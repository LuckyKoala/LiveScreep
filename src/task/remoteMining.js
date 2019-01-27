const ServiceConstruction = require('service_construction');

var mod = {};
module.exports = mod;

mod.loop = function() {
    const flags = _.filter(Game.flags, o => FlagUtil.remoteMining.examine(o));
    for(const flag of flags) {
        //Extract flag data
        const destinedTarget = flag.name;
        let assignedRoom = flag.memory.assignedRoom;
        if(assignedRoom === undefined) {
            //Find suitable room to do this task
            //NOTE: Currently we only calculate range
            let range = Infinity;
            let selectedRoomName;
            for(const roomName in Game.rooms) {
                const room = Game.rooms[roomName];
                const roomType = room.memory.roomType;
                if(roomType && roomType === C.OWNED_ROOM && room.controller.level>=2) {
                    const r = Game.map.getRoomLinearDistance(flag.pos.roomName, roomName);
                    if(r < range) {
                        range = r;
                        selectedRoomName = roomName;
                    }
                }
            }
            assignedRoom = selectedRoomName;
            //Write back to memory
            flag.memory.assignedRoom = assignedRoom;
            Logger.info(`Detect new remote mining flag => ${flag.name} and assigned to [${assignedRoom}]`);
        }
        //Do we have a assignedRoom now?
        if(assignedRoom) {
            //====== Builders on demand ======
            //Loop construction
            ServiceConstruction.loopRemoteMining(flag);
            //Is there sites need to be build or road need to be repair?
            if(flag.room) {
                const sites = _.filter(flag.room.cachedFind(FIND_CONSTRUCTION_SITES), c => c.my);
                const lastRepairTick = flag.room.memory.lastRepairTick || 0;
                if(sites.length > 0 || (Game.time-lastRepairTick)>1500) {
                    //Find builder and assign destinedTarget to sent builder outside when it is available
                    const builders = _.filter(Game.rooms[assignedRoom].cachedCreeps(), c => c.memory.role===C.BUILDER && c.memory.destinedTarget===undefined);
                    if(builders.length>0) {
                        const builder = builders[0];
                        builder.memory.destinedTarget=destinedTarget;
                        Logger.info(`Sending ${builder.name} to ${destinedTarget}`);
                    }
                } else {
                    //Find builder which is assigned to current flag, unassigned it
                    const builders = _.filter(Game.rooms[assignedRoom].cachedCreeps(), c => c.memory.role===C.BUILDER && c.memory.destinedTarget===destinedTarget);
                    if(builders.length>0) {
                        const builder = builders[0];
                        delete builder.memory.destinedTarget;
                        Logger.info(`Sending ${builder.name} back from ${destinedTarget}`);
                    }
                }
            }

            //====== Guardians on demand ======
            if(flag.room) {
                if(flag.room.memory.underAttack) {
                    //Find guardians and assign destinedTarget to sent guardians outside when it is available
                    const guardians = _.filter(Game.rooms[assignedRoom].cachedCreeps(), c => c.memory.role===C.GUARDIAN && c.memory.destinedTarget===undefined);
                    _.forEach(guardians, guardian => {
                        guardian.memory.destinedTarget = destinedTarget;
                        Logger.info(`Sending ${guardian.name} to ${destinedTarget}`);
                    });
                } else {
                    //Find guardians which is assigned to current flag, unassigned it
                    const guardians = _.filter(Game.rooms[assignedRoom].cachedCreeps(), c => c.memory.role===C.GUARDIAN && c.memory.destinedTarget===destinedTarget);
                    _.forEach(guardians, guardian => {
                        delete guardian.memory.destinedTarget;
                        Logger.info(`Sending ${guardian.name} back from ${destinedTarget}`);
                    });
                }
            }


            //Enqueue remote-mining task related creeps
            this.queueCreeps(assignedRoom, destinedTarget);
        }
    }
};

const QueuePeriod = 10;

mod.queueCreeps = function(roomName, destinedTarget) {
    const flag = Game.flags[destinedTarget];
    const lastQueueTime = flag.memory.lastQueueTime || 0;
    if((Game.time-lastQueueTime)<QueuePeriod) return;
    flag.memory.lastQueueTime = Game.time;

    //=== Role count ===
    const roomCreeps = _.filter(Game.creeps, function(creep) { return creep.memory.destinedTarget === destinedTarget; });
    let cnt = {
        total: 0,
    };
    _.forEach(Role, o => cnt[o.roleName] = 0); //Init cnt
    //All role is required
    for(let creep of roomCreeps) {
        const role = creep.memory.role;
        if(creep.spawning || Setup[role] && creep.ticksToLive >= Setup[role].prespawn) {
            cnt[role]++;
            cnt.total++;
        }
    }
    //Count role in queue as well
    const queueRoom = Game.rooms[roomName];
    const queue = queueRoom.queue.extern;
    for(const setupArr of queue) {
        const setupName = setupArr[0];
        const extraMemory = setupArr[1];
        if(extraMemory.destinedTarget === destinedTarget) {
            const role = setupName;
            cnt[role]++;
            cnt.total++;
        }
    }

    //Prepare objects needed
    const extraMemory = {
        destinedTarget: destinedTarget
    };
    const targetRoomName = flag.pos.roomName;
    const room = Game.rooms[targetRoomName];

    //Do we have vision of that room?
    if(room === undefined) {
        //No vision
        if(!Util.Observer.requestVision(targetRoomName)) {
            //No observer to use
            //Spawn a scout
            if(cnt[C.SCOUT]===0) {
                queueRoom.queue.extern.push([C.SCOUT, extraMemory]);
                cnt[C.SCOUT]++;
            }
        }
        return;
    }

    if(!queueRoom.storage) {
        //Can't afford spawn cost of claimer
        // sent remoteWorkers instead of a remote group
        if(room) {
            //=== Harvest all sources and spawn dedicated hauler ===
            let needWorker = room.sources.length*2 - cnt[C.REMOTE_WORKER];
            //Actually enqueue harvesters and haulers
            while(needWorker-- > 0) {
                queueRoom.queue.extern.push([C.REMOTE_WORKER, extraMemory]);
                cnt[C.REMOTE_WORKER]++;
            }
            //==== Recycle remoteHauler and remoteHarvester ====
            if(cnt[C.REMOTE_HARVESTER]>0 || cnt[C.REMOTE_HAULER]>0) {
                Logger.info(`Recycling remoteHarvester and remoteHauler of ${destinedTarget} due to lack of energy in storage`);
                _.forEach(roomCreeps, c => {
                    if(c.memory.role===C.REMOTE_HARVESTER || c.memory.role===C.REMOTE_HAULER) {
                        c.memory.role = C.RECYCLER;
                    }
                });
            }
        }

        return;
    } else {
        //==== Recycle remoteWorker ====
        if(cnt[C.REMOTE_WORKER]>0) {
            Logger.info(`Recycling remoteWorker of ${destinedTarget} due to presence of storage`);
            _.forEach(roomCreeps, c => {
                if(c.memory.role===C.REMOTE_WORKER) {
                    c.memory.role = C.RECYCLER;
                }
            });
        }
    }

    //=== Keep room reserved ===
    const controller = room.controller;
    if(controller && controller.canTouch) {
        const reservation = controller.reservation;
        if(reservation && reservation.username===C.USERNAME && reservation.ticksToEnd>1000) {
            //No need to spawn reserver
        } else if(cnt[C.RESERVER]===0) {
            queueRoom.queue.extern.push([C.RESERVER, extraMemory]);
            cnt[C.RESERVER]++;
        }
    }

    //====== Calculate path length between remote sources and home controller ======
    let avgPathLength = flag.memory.avgPathLength;
    if(avgPathLength === undefined) {
        let length = 0;
        let goals = _.map(room.sources, function(source) {
            // We can't actually walk on sources-- set `range` to 1
            // so we path next to it.
            return { pos: source.pos, range: 1 };
        });
        const pathObj = PathFinder.search(queueRoom.storage.pos, goals);
        avgPathLength = pathObj.path.length;
        //Write back
        flag.memory.avgPathLength = avgPathLength;
    }

    //=== Harvest all sources and spawn dedicated hauler ===
    //That is one pair of harvester-hauler for the room
    const energyGenPerTick = room.sources.length*10; //hardcode for 5work*2harvest_power per source
    const energyHaulPerRound = queueRoom.storage.store[RESOURCE_ENERGY]>=Config.StorageBoundForSpawnRecovery ? 1600 : 500; //hardcode for 32carry
    const ticksPerRound = avgPathLength*2; //best situation: there are well maintained roads on the path, so move speed is 1 tile/tick
    const haulerLimit = Math.ceil(energyGenPerTick*ticksPerRound/energyHaulPerRound);
    //Logger.debug(`[${queueRoom.name} <-> ${flag.room.name}] ${haulerLimit}`);
    let needHarvester = room.sources.length - cnt[C.REMOTE_HARVESTER];
    let needHauler = haulerLimit - cnt[C.REMOTE_HAULER];
    if(needHarvester>0) {
        queueRoom.queue.extern.push([C.REMOTE_HARVESTER, extraMemory]);
        cnt[C.REMOTE_HARVESTER]++;
    }
    if(needHauler>0) {
        queueRoom.queue.extern.push([C.REMOTE_HAULER, extraMemory]);
        cnt[C.REMOTE_HAULER]++;
    }
};

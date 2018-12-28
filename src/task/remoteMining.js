var mod = {};
module.exports = mod;

mod.loop = function() {
    const flags = _.filter(Game.flags, o => FlagUtil.remoteMining.examine(o));
    for(const flag of flags) {
        //Extract flag data
        const destinedTarget = flag.name;
        let assignedRoom = flag.memory.assignedRoom;
        if(assignedRoom === undefined) {
            console.log(`Detect new remote mining flag => ${flag.name}`);
            //Find suitable room to do this task
            //NOTE: Currently we only calculate range
            let range = Infinity;
            let selectedRoomName;
            for(const roomName in Game.rooms) {
                console.log(roomName);
                const room = Game.rooms[roomName];
                const roomType = room.memory.roomType;
                if(roomType && roomType === C.OWNED_ROOM && room.controller.level>=3) {
                    const r = Game.map.getRoomLinearDistance(flag.pos.roomName, roomName);
                    if(r < range) {
                        range = r;
                        selectedRoomName = roomName;
                    }
                }
            }
            assignedRoom = selectedRoomName;
        }
        //Do we have a assignedRoom now?
        if(assignedRoom) {
            //Write back to memory
            flag.memory.assignedRoom = assignedRoom;
            //Enqueue remote-mining task related creeps
            this.queueCreeps(assignedRoom, destinedTarget);
        }
    }
};

mod.queueCreeps = function(roomName, destinedTarget) {
    //=== Role count ===
    const roomCreeps = _.filter(Game.creeps, function(creep) { return creep.memory.destinedTarget === destinedTarget; });
    let cnt = {
        total: 0,
    };
    _.forEach(Role, o => cnt[o.roleName] = 0); //Init cnt
    //All role is required
    for(let creep of roomCreeps) {
        const role = creep.memory.role;
        cnt[role]++;
        cnt.total++;
    }
    //Count role in queue as well
    const queueRoom = Game.rooms[roomName];
    const queue = queueRoom.queue.extern;
    for(const setupArr of queue) {
        const setupName = setupArr[0];
        const role = setupName;
        cnt[role]++;
        cnt.total++;
    }
    
    //Prepare objects needed
    const extraMemory = {
        destinedTarget: destinedTarget
    };
    //Do we need to spawn guardian ?
    //Guardian provide vision too
    if(cnt[C.REMOTE_GUARDIAN]===0) {
        queueRoom.queue.extern.unshift([C.REMOTE_GUARDIAN, extraMemory]);
        cnt[C.REMOTE_GUARDIAN]++;
        return;
    }
    //TODO normally send scout to provide vision
    //   only sent defense when 
    //Do we have vision of that room?
    let room = Game.rooms[Game.flags[destinedTarget].pos.roomName];
    if(room === undefined) {
        //No vision
        //Spawn a scout first
        /*
        if(cnt[C.SCOUT]===0) {
            queueRoom.queue.extern.push([C.SCOUT, extraMemory]);
            cnt[C.SCOUT]++;
        }
        */
        return;
    }

    //=== Keep room reserved ===
    const controller = room.controller;
    if(controller) {
        const reservation = controller.reservation;
        if(reservation && reservation.username===C.USERNAME && reservation.ticksToEnd>1000) {
            //No need to spawn reserver
        } else if(cnt[C.RESERVER]===0) {
            queueRoom.queue.extern.push([C.RESERVER, extraMemory]);
            cnt[C.RESERVER]++;
        }
    }

    //=== Harvest all sources and spawn dedicated hauler ===
    //That is one pair of harvester-hauler per source
    let needHarvester = room.sources.length - cnt[C.REMOTE_HARVESTER];
    let needHauler = 1 - cnt[C.REMOTE_HAULER];
    //Actually enqueue harvesters and haulers
    while(needHarvester-- > 0) {
        queueRoom.queue.extern.push([C.REMOTE_HARVESTER, extraMemory]);
        cnt[C.REMOTE_HARVESTER]++;
        //Spawn matched hauler
        if(needHauler-- > 0) {
            queueRoom.queue.extern.push([C.REMOTE_HAULER, extraMemory]);
            cnt[C.REMOTE_HAULER]++;
        }
    }
    //If harvester is enough and hauler is not enough
    // just spawn it alone
    while(needHauler-- > 0) {
        queueRoom.queue.extern.push([C.REMOTE_HAULER, extraMemory]);
        cnt[C.REMOTE_HAULER]++;
    }
};

var mod = {};
module.exports = mod;

mod.loop = function() {
    const flags = _.filter(Game.flags, o => FlagUtil.outpost.examine(o));
    for(const flag of flags) {
        //Extract flag data
        const destinedTarget = flag.name;
        let assignedRoom = flag.memory.assignedRoom;
        if(assignedRoom === undefined) {
            console.log(`Detect new outpost flag => ${flag.name}`);
            //Find suitable room to do this task
            //NOTE: Currently we only calculate range
            let range = Infinity;
            let selectedRoomName;
            for(const roomName in Game.rooms) {
                console.log(roomName);
                const room = Game.rooms[roomName];
                const roomType = room.memory.roomType;
                if(roomType && roomType === C.OWNED_ROOM && room.controller.level>=6) {
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
    //Firstly, send a scout to get vision of target room
    const flag = Game.flags[destinedTarget];
    const logPrefix = `[Outpost(${flag.pos.roomName})]`;
    if(!flag.room) {
        //no vision
        if(cnt[C.SCOUT]===0) {
            console.log(logPrefix+'Scouting...');
            queueRoom.queue.extern.unshift([C.SCOUT, extraMemory]);
            cnt[C.SCOUT]++;
        }
        return;
    }
    //Secondly, send a claimer to claim target room
    const targetRoom = flag.room;
    if(!targetRoom.controller.my) {
        //Need to be claim
        if(cnt[C.CLAIMER]===0) {
            console.log(logPrefix+'Claiming...');
            queueRoom.queue.extern.unshift([C.CLAIMER, extraMemory]);
            cnt[C.CLAIMER]++;
        }
        return;
    }
    //Then, calculate amount and parts of pioneers and send them to
    //  build target room to RCL 3 with a spawn
    // 1. Place a spawn site
    const spawnSites = _.filter(targetRoom.cachedFind(FIND_CONSTRUCTION_SITES), s => s.structureType===STRUCTURE_SPAWN);
    if(targetRoom.spawns.length===0 && spawnSites.length===0) {
        targetRoom.createConstructionSite(flag.pos, STRUCTURE_SPAWN);
    }
    // 2. Sent pioneers to do the work
    if(targetRoom.spawns.length===0) {
        if(cnt[C.PIONEER]<2) {
            console.log(logPrefix+'Building...');
            queueRoom.queue.extern.unshift([C.PIONEER, extraMemory]);
            cnt[C.PIONEER]++;
        }
    } else {
        // 3. Convert to Task.Base
        console.log(logPrefix+'Converting...');
        //Convert all remain creep to be a local residents
        const creeps = targetRoom.cachedFind(FIND_MY_CREEPS);
        //let harvesterHeadCount = targetRoom.sources.length;
        let harvesterHeadCount = 1;
        for(let creep of creeps) {
            delete creep.memory.destinedTarget;
            creep.memory.homeRoom = targetRoom.name;
            const role = creep.memory.role;
            switch(role) {
            case C.SCOUT:
            case C.CLAIMER:
                creep.memory.role = C.RECYCLER;
                break;
            case C.PIONEER:
                if(harvesterHeadCount>0) {
                    creep.memory.role = C.HARVESTER;
                    harvesterHeadCount--;
                } else {
                    creep.memory.role = C.HAULER;
                    haulerHeadCount--;
                }
                break;
            }
        }
        //Convert flag
        const pos = flag.pos;
        flag.remove();
        targetRoom.createFlag(pos, 'base_'+targetRoom.name, FlagUtil.base.color, FlagUtil.base.secondaryColor);
    }
};

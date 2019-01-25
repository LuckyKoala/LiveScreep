
var mod = {};
module.exports = mod;

//Guardian and security squad for remote room
mod.loop = function() {
    const flags = _.filter(Game.flags, o => FlagUtil.defending.examine(o));
    for(const flag of flags) {
        const room = flag.room;
        if(room) {
            //We do have vision
            this.queueCreeps(room);
        } else {
            //No vision
            // but this flag should only place in base room!
            Logger.warning(`Found defending(base) flag[${flag.name}] in no-vision room[${flag.roomName}]!`);
        }
    }
};

mod.queueCreeps = function(room) {
    if(room.energyCapacityAvailable<Setup[C.HARVESTER].setupConfig.Normal.minEnergy) {
        Logger.trace('skip task.defending.queueCreeps due to low energyCapacityAvailable');
        return;
    }
    //=== Role count ===
    const cnt = room.cachedRoleCount();

    //Spawn a guardian
    if(cnt.total[C.GUARDIAN] < 1) {
        room.queue.normal.unshift(C.GUARDIAN);
        cnt.queue[C.GUARDIAN]++;
        cnt.total[C.GUARDIAN]++;
    }

    if(room.storage && room.storage.store[RESOURCE_ENERGY]>Config.StorageBoundForWallMaintainer && cnt.total[C.WALLMAINTAINER] < 1) {
        const ramparts = room.cachedFind(FIND_MY_STRUCTURES).filter(o => o.structureType===STRUCTURE_RAMPART);
        const rampartSites = room.cachedFind(FIND_MY_CONSTRUCTION_SITES).filter(o => o.structureType===STRUCTURE_RAMPART);
        if((ramparts.length+rampartSites.length) > 0) {
            room.queue.normal.push(C.WALLMAINTAINER);
            cnt.queue[C.WALLMAINTAINER]++;
            cnt.total[C.WALLMAINTAINER]++;
        }
    }
};

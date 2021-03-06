var mod = {};
module.exports = mod;

mod.loop = function() {
    const flags = _.filter(Game.flags, o => FlagUtil.upgrading.examine(o));
    for(const flag of flags) {
        const room = flag.room;
        if(room) {
            //We do have vision
            this.queueCreeps(room);
        } else {
            //No vision
            // but this flag should only place in base room!
            Logger.warning(`Found upgrading(base) flag[${flag.name}] in no-vision room[${flag.roomName}]!`);
        }
    }
};

//Upgrader and keeper
mod.queueCreeps = function(room) {
    if(room.energyCapacityAvailable<Setup[C.HARVESTER].setupConfig.Normal.minEnergy) {
        Logger.trace('skip task.upgrading.queueCreeps due to low energyCapacityAvailable');
        return;
    }
    //=== Role count ===
    const cnt = room.cachedRoleCount();

    //Storage rebuild routine
    if(room.terminal && room.storage && room.terminal.store[RESOURCE_ENERGY]>room.storage.store[RESOURCE_ENERGY] && cnt.total[C.KEEPER]===0) {
        room.queue.normal.push(C.KEEPER);
        cnt.queue[C.KEEPER]++;
        cnt.total[C.KEEPER]++;
    }

    const storage = room.storage || room.terminal;
    if(storage && storage.store[RESOURCE_ENERGY] < Config.StorageBoundForSpawn) {
        Logger.trace('skip task.upgrading.queueCreeps due to lack of energy in storage');
        return;
    }


    let upgraderAmount;
    if(room.controller.level === 8) {
        upgraderAmount = 1;
    } else {
        //If currently energy capacity can't afford single bigger creep
        // then let's add amount of upgraders
        const energyForSpawnCapacity = room.energyCapacityAvailable;
        const setup = Setup[C.UPGRADER];
        const dynamicMaxExtraAmount = setup.dynamicExtraAmount(room);
        const totalEnergyNeed = setup.setupConfig.Normal.minEnergy + dynamicMaxExtraAmount * Util.Helper.getBodyCost(setup.setupConfig.Normal.extraBody);
        upgraderAmount = Math.ceil(totalEnergyNeed/energyForSpawnCapacity);
        upgraderAmount = Math.min(3, upgraderAmount); // 3 at most, more creep more cpu and more crowded
        upgraderAmount = Math.max(0, upgraderAmount); // 0 at least
    }

    if(room.controller.container) {
        if(upgraderAmount > 0) {
            //Only spawn keeper if storage present
            //spawn keeper first, so there will be energy source for upgrader
            if(storage && cnt.total[C.KEEPER] === 0) {
                room.queue.normal.push(C.KEEPER);
                cnt.queue[C.KEEPER]++;
                cnt.total[C.KEEPER]++;
            }
        }
        if(cnt.total[C.UPGRADER] < upgraderAmount) {
            room.queue.normal.push(C.UPGRADER);
            cnt.queue[C.UPGRADER]++;
            cnt.total[C.UPGRADER]++;
        }
    } else {
        if(cnt.total[C.UPGRADER] < upgraderAmount) {
            room.queue.normal.push(C.UPGRADER);
            cnt.queue[C.UPGRADER]++;
            cnt.total[C.UPGRADER]++;
        }
    }
};

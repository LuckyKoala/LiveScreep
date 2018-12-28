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
            console.log(`Found upgrading(base) flag[${flag.name}] in no-vision room[${flag.roomName}]!`);
        }
    }
};

//Upgrader and keeper
mod.queueCreeps = function(room) {
    //=== Role count ===
    const cnt = room.cachedRoleCount();

    //spawn keeper first, so there will be energy source for upgrader
    if(cnt.total[C.KEEPER] === 0) {
        room.queue.normal.push(C.KEEPER);
        cnt.queue[C.KEEPER]++;
        cnt.total[C.KEEPER]++;
    }

    //Only spawn upgrader if there is no structures need to be build
    const energyForSpawnCapacity = room.energyCapacityAvailable;
    const dynamicMaxExtraAmount = Setup[C.UPGRADER].dynamicExtraAmount(room);
    const totalEnergyNeed = 650+dynamicMaxExtraAmount*700;
    //Currently energy capacity can't afford single bigger creep
    // so let's add amount of upgraders
    let upgraderAmount = Math.floor(totalEnergyNeed/energyForSpawnCapacity);
    upgraderAmount = Math.min(3, upgraderAmount); // 3 at most, more creep more cpu and more crowded
    const needBuildStructures = room.cachedFind(FIND_CONSTRUCTION_SITES);
    if(needBuildStructures.length === 0 && cnt.total[C.UPGRADER] < upgraderAmount) {
        room.queue.normal.push(C.UPGRADER);
        cnt.queue[C.UPGRADER]++;
        cnt.total[C.UPGRADER]++;
    }
};

var mod = {};
module.exports = mod;

mod.loop = function() {
    const flags = _.filter(Game.flags, o => FlagUtil.building.examine(o));
    for(const flag of flags) {
        const room = flag.room;
        if(room) {
            //We do have vision
            this.queueCreeps(room);
        } else {
            //No vision
            // but this flag should only place in base room!
            console.log(`Found building(base) flag[${flag.name}] in no-vision room[${flag.roomName}]!`);
        }
    }
};

//Builder
mod.queueCreeps = function(room) {
    //=== Role count ===
    const cnt = room.cachedRoleCount();

    //
    //If there are sites need to be build or structures need to be maintain,
    //  spawn a builder.
    const needBuildStructures = room.cachedFind(FIND_CONSTRUCTION_SITES);
    const needRepairStructures = room.cachedFind(FIND_STRUCTURES, {
        filter: function(o) {
            return o.hits < o.hitsMax;
        }
    });
    const needBuilder = (needBuildStructures.length + needRepairStructures.length) > 0;
    if(needBuilder && cnt.total[C.BUILDER]<1) {
        room.queue.normal.push(C.BUILDER);
        cnt.queue[C.BUILDER]++;
        cnt.total[C.BUILDER]++;
    }
};

var mod = {};
module.exports = mod;

mod.loop = function() {
    const flags = _.filter(Game.flags, o => FlagUtil.working.examine(o));
    for(const flag of flags) {
        const room = flag.room;
        if(room) {
            //We do have vision
            this.queueCreeps(room);
        } else {
            //No vision
            // but this flag should only place in base room!
            Logger.warning(`Found working(base) flag[${flag.name}] in no-vision room[${flag.roomName}]!`);
        }
    }
};

//Worker
mod.queueCreeps = function(room) {
    if(room.energyCapacityAvailable>=Setup[C.HARVESTER].setupConfig.Normal.minEnergy) {
        Logger.trace('skip task.working.queueCreeps due to normal energyCapacityAvailable');
        return;
    }
    //=== Role count ===
    const cnt = room.cachedRoleCount();
    const workerLimit = 3*room.sources.length;
    if(cnt.total[C.WORKER] < workerLimit) {
        room.queue.normal.push(C.WORKER);
        cnt.queue[C.WORKER]++;
        cnt.total[C.WORKER]++;
    }
};

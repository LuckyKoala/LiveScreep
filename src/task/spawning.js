var mod = {};
module.exports = mod;

mod.loop = function() {
    const flags = _.filter(Game.flags, o => FlagUtil.spawning.examine(o));
    for(const flag of flags) {
        const room = flag.room;
        if(room) {
            //We do have vision
            this.queueCreeps(room);
        } else {
            //No vision
            // but this flag should only place in base room!
            Logger.warning(`Found spawning(base) flag[${flag.name}] in no-vision room[${flag.roomName}]!`);
        }
    }
};

//Filler
mod.queueCreeps = function(room) {
    //=== Role count ===
    const cnt = room.cachedRoleCount();

    if(room.storage) {
        //We still have energy in storage
        // Do we have a filler to transfer energy from storage to spawns/extensions?
        if(cnt.total[C.FILLER]>=1) {
            //We do have a filler at least
            // but is it bigger enough or is it will die soon?
            //For now, we spawn two fillers, so they can help each other
            if(cnt.total[C.FILLER]===1) {
                room.queue.normal.unshift(C.FILLER);
                cnt.queue[C.FILLER]++;
                cnt.total[C.FILLER]++;
            }
        } else {
            room.queue.urgent.unshift(C.FILLER);
            cnt.queue[C.FILLER]++;
            cnt.total[C.FILLER]++;
        }
    } else {
        //No storage, then it is low rcl room, task.mining will take
        // care of spawning too
    }
};

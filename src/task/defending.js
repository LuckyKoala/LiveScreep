
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
            console.log(`Found defending(base) flag[${flag.name}] in no-vision room[${flag.roomName}]!`);
        }
    }
};

mod.queueCreeps = function(room) {
    //=== Role count ===
    const cnt = room.cachedRoleCount();

    //Spawn a guardian if it is neccessary -> goto util.defense
    if(cnt.total[C.GUARDIAN] === 0 && Util.Defense.shouldSpawnGuardian(room)) {
        room.queue.normal.push(C.GUARDIAN);
        cnt.queue[C.GUARDIAN]++;
        cnt.total[C.GUARDIAN]++;
    }
};

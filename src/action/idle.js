let mod = new ActionObj('Idle');
module.exports = mod;

mod.nextTarget = function() {
    return true;
};

mod.word = '🍽︎ idle';

function makeIdleEntry(creep) {
    const pos = creep.pos;
    return `${pos.x},${pos.y}`;
}

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        let lastIdleTick = creep.memory.lastIdleTick || 0;
        let lastIdleCnt = creep.memory.lastIdleCnt || 0;
        if(Game.time-lastIdleTick===1) {
            creep.room.State[C.STATE.IDLE_CREEPS].push(creep.id);

            lastIdleCnt++;
        } else {
            lastIdleCnt = 0;
        }

        creep.memory.lastIdleTick = Game.time;
        return false;
    });
};

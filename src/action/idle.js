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
        creep.memory.lastIdleTick = Game.time;
        return false;
    });
};

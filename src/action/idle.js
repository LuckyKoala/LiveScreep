let mod = new ActionObj('Idle');
module.exports = mod;

mod.nextTarget = function() {
    return true;
};

mod.word = '🍽︎ idle';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        let lastIdleTick = creep.memory.lastIdleTick || 0;
        let lastIdleCnt = creep.memory.lastIdleCnt || 0;
        if(Game.time-lastIdleTick===1) {
            lastIdleCnt++;
        }
        if(lastIdleCnt>4) {
            //Do random move
            const dir = Math.ceil(Math.random() * 8);
            creep.move(dir);
            creep.memory.lastIdleCnt = 0;
        } else {
            creep.memory.lastIdleCnt = lastIdleCnt;
        }

        creep.memory.lastIdleTick = Game.time;
        return false;
    });
};

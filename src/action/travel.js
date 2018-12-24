let mod = new ActionObj('Travel');
module.exports = mod;

mod.nextTarget = function() {
    if(creep.room.name === target.room.name) {
        return false;
    }
    //Only support flag.
    if(creep.memory.destinedTarget) {
        const obj = Game.flags[creep.memory.destinedTarget];
        return obj;
    }
    return false;
};

mod.word = '🕵︎ travel';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
    });
};

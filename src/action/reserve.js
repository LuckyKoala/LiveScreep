let mod = new ActionObj('Reserve');
module.exports = mod;

mod.nextTarget = function() {
    return this.creep.room.controller;
};

mod.word = '🕵︎ Reserve';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        if(creep.reserveController(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    });
};

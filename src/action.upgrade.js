let mod = new ActionObj('Upgrade');
module.exports = mod;

mod.nextTarget = function() {
    return this.creep.room.controller;
};

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        if(creep.upgradeController(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    });
};
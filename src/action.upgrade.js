let mod = new ActionObj('Upgrade');
module.exports = mod;

mod.nextTarget = function() {
    return this.creep.room.controller;
};

mod.loop = function(creep) {
    this.creep = creep;
    var target = this.nextTarget();
    if(creep.upgradeController(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
    }
};
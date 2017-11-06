let mod = new ActionObj('Upgrade');
module.exports = mod;

mod.nextTarget = function() {
    return this.creep.room.controller;
};

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        creep.withdraw(creep.room.controller.container, RESOURCE_ENERGY);
        const result = creep.upgradeController(target);
        if(result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    });
};
let mod = new ActionObj('Upgrade');
module.exports = mod;

mod.nextTarget = function() {
    return this.creep.room.controller;
};

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        //Only work for controller container exist and it is located at where
        //  creep can do withdraw and upgrade at same tick
        const result = creep.withdraw(creep.room.controller.container, RESOURCE_ENERGY);
        creep.upgradeController(target);
        if(result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    });
};
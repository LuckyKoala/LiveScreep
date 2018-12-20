//Storage handler
// storage -> spawns and extensions
// storage -> towers
// storage -> controller.container
var mod = new RoleObj('Filler');
module.exports = mod;

mod.roleConfig = {
    inStack: [Action.Withdraw, Action.Pickup],
    outStack: [Action.Fill, Action.Fuel, Action.PutForUpgrade],
};

mod.loop = function(creep) {
    if(creep.memory.filling && creep.carry.energy == 0) {
        creep.memory.filling = false;
    }
    if(!creep.memory.filling && creep.carry.energy == creep.carryCapacity) {
        creep.memory.filling = true;
    }

    this.loop0(creep, creep.memory.filling);
};

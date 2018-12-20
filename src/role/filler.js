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
    if(!creep.memory.filling) {
        const storage = creep.room.storage;
        if(storage.store[RESOURCE_ENERGY] === 0 && creep.carry.energy > 0) {
            //No more energy, so don't wait if filler carry on any energy
            creep.memory.filling = true;
        } else if(creep.carry.energy === creep.carryCapacity) {
            //We have enough energy, go to working!
            creep.memory.filling = true;
        }
    }

    this.loop0(creep, creep.memory.filling);
};

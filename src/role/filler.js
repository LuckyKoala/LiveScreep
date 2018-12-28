//Storage handler
// storage -> spawns and extensions
var mod = new RoleObj(C.FILLER);
module.exports = mod;

mod.roleConfig = {
    inStack: [Action.Withdraw],
    //If no fill target, then put energy to storage
    // thought that, filler can keep spawnLink empty
    // so sourceLinks won't block
    outStack: [Action.Fill, Action.Store],
};

mod.loop = function(creep) {
    if(creep.memory.filling && creep.carry.energy == 0) {
        creep.memory.filling = false;
    }
    if(!creep.memory.filling && creep.carry.energy === creep.carryCapacity) {
        //We have enough energy, go to working!
        creep.memory.filling = true;
    }

    this.loop0(creep, creep.memory.filling);
};

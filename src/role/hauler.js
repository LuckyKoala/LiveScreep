var mod = new RoleObj(C.HAULER);
module.exports = mod;

//TODO If there is no storage
// we may choose to abandon mineral resource on creep
mod.roleConfigWithStorage= {
    inStack: [Action.Travel, Action.Pickup, Action.Withdraw],
    outStack: [Action.Travel, Action.Store],
};

mod.roleConfigWithoutStorage= {
    inStack: [Action.Travel, Action.Pickup, Action.Withdraw],
    outStack: [Action.Travel, Action.Fill, Action.PutForUpgrade],
};

mod.loop = function(creep) {
    if(creep.room.storage) {
        this.roleConfig = this.roleConfigWithStorage;
    } else {
        this.roleConfig = this.roleConfigWithoutStorage;
    }

    if(creep.memory.hauling &&  _.sum(creep.carry) === 0) {
        creep.memory.hauling = false;
    }
    if(!creep.memory.hauling && _.sum(creep.carry) === creep.carryCapacity) {
        creep.memory.hauling = true;
    }

    this.loop0(creep, creep.memory.hauling);
};

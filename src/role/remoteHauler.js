var mod = new RoleObj(C.REMOTE_HAULER);
module.exports = mod;

mod.roleConfig = {
    inStack: [Action.Travel, Action.FromTombstone, Action.FromContainer, Action.Pickup],
    outStack: [Action.Help, Action.Back, Action.PutToLink, Action.PutToStorage, Action.PutToTerminal, Action.PutToKeeper, Action.Fill, Action.Fuel, Action.PutForUpgrade],
};

mod.loop = function(creep) {
    if(creep.memory.hauling &&  _.sum(creep.carry) === 0) {
        creep.memory.hauling = false;
    }
    if(!creep.memory.hauling && _.sum(creep.carry) === creep.carryCapacity) {
        creep.memory.hauling = true;
    }

    this.loop0(creep, creep.memory.hauling);
};

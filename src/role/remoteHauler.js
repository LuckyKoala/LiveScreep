var mod = new RoleObj(C.REMOTE_HAULER);
module.exports = mod;

mod.roleConfig = {
    inStack: [Action.Travel, Action.Pickup, Action.FromTombstone, Action.FromContainer],
    outStack: [Action.Help, Action.Back, Action.PutToLink, Action.Store, Action.Fill, Action.Fuel, Action.PutForUpgrade],
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

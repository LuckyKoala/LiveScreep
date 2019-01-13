var mod = new RoleObj(C.HAULER);
module.exports = mod;

mod.roleConfig= {
    inStack: [Action.FromTombstone, Action.FromContainer, Action.FromLink, Action.Pickup],
    outStack: [Action.Store, Action.Fill, Action.Help, Action.PutForUpgrade],
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

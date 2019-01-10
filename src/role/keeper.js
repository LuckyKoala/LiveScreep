var mod = new RoleObj(C.KEEPER);
module.exports = mod;

mod.roleConfig = {
    inStack: [Action.Withdraw],
    outStack: [Action.Fill, Action.Fuel, Action.PutForUpgrade, Action.Help],
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

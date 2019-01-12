var mod = new RoleObj(C.WORKER);
module.exports = mod;

mod.roleConfig = {
    inStack: [Action.Pickup, Action.FromContainer],
    outStack: [Action.Build, Action.Upgrade],
};

mod.loop = function(creep) {
    if(creep.memory.building &&  _.sum(creep.carry) === 0) {
        creep.memory.building = false;
    }
    if(!creep.memory.building && _.sum(creep.carry) === creep.carryCapacity) {
        creep.memory.building = true;
    }

    this.loop0(creep, creep.memory.building);
};

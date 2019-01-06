var mod = new RoleObj(C.REMOTE_WORKER);
module.exports = mod;

mod.roleConfig = {
    inStack: [Action.Travel, Action.Pickup, Action.Harvest],
    outStack: [Action.Back, Action.Fill, Action.Fuel, Action.Store, Action.Build, Action.Upgrade],
};

mod.loop = function(creep) {
    if(creep.memory.hauling &&  _.sum(creep.carry) === 0) {
        creep.memory.hauling = false;
    }
    if(!creep.memory.hauling && _.sum(creep.carry) === creep.carryCapacity) {
        creep.memory.hauling = true;
        delete creep.memory.sourceMark;
    }

    this.loop0(creep, creep.memory.hauling);
};

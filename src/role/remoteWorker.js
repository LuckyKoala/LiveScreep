var mod = new RoleObj(C.REMOTE_WORKER);
module.exports = mod;

mod.roleConfig = {
    inStack: [Action.Travel, Action.Pickup, Action.FromContainer, Action.Harvest],
    outStack: [Action.Back, Action.PutToStorage, Action.PutToTerminal, Action.PutToKeeper, Action.Fill, Action.Fuel, Action.Build, Action.Upgrade],
};

mod.loop = function(creep) {
    if(creep.memory.hauling &&  _.sum(creep.carry) === 0) {
        creep.memory.hauling = false;
    }
    if(!creep.memory.hauling && _.sum(creep.carry) === creep.carryCapacity) {
        creep.memory.hauling = true;
        Util.SourceMark.clearSourceMark(creep);
    }

    this.loop0(creep, creep.memory.hauling);
};

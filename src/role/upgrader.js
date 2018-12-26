var mod = new RoleObj(C.UPGRADER);
module.exports = mod;

mod.roleConfig = {
    inStack: [Action.Withdraw],
    outStack: [Action.Upgrade],
};

mod.loop = function(creep) {
    if(creep.memory.upgrading && creep.carry.energy == 0) {
        creep.memory.upgrading = false;
    }
    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
        creep.memory.upgrading = true;
    }
    this.loop0(creep, !!creep.memory.upgrading);
};

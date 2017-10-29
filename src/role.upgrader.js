var mod = new RoleObj('Upgrader');
module.exports = mod;

mod.roleConfig = {
    inStack: [Action.Withdraw, Action.Harvest],
    outStack: [Action.Upgrade],
};
mod.loop = function(creep) {
    if(creep.memory.upgrading && creep.carry.energy == 0) {
        creep.memory.upgrading = false;
        creep.say('🔄 harvest');
    }
    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
        creep.memory.upgrading = true;
        creep.say('⚡ upgrade');
    }

    this.loop0(creep, creep.memory.upgrading);
};
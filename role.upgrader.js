var mod = new RoleObj('Upgrader');
module.exports = mod;

mod.roleConfig = {
    inStack: [Task.Harvest],
    outStack: [Task.Upgrade],
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

    if(creep.memory.upgrading) {
        var task = this.roleConfig.outStack[0];
        task.loop(creep);
    }
    else {
        var task = this.roleConfig.inStack[0];
        task.loop(creep);
    }
};
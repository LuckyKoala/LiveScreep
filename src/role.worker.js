var mod = new RoleObj('Worker');
module.exports = mod;

//TODO low/normal
mod.Setup = {
    essBody: [WORK, CARRY, MOVE],
    extraBody: [WORK, CARRY, MOVE],
    prefix: '[Worker]',
    memory: {role: 'worker'},
};

mod.roleConfig = {
    inStack: [Action.Harvest],
    outStack: [Action.Upgrade],
};

mod.loop = function(creep) {
    if(creep.memory.upgrading && creep.carry.energy == 0) {
        creep.memory.upgrading = false;
        creep.say('🔄 charge');
    }
    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
        creep.memory.upgrading = true;
        creep.say('⚡ upgrade');
    }

    this.loop0(creep, !!creep.memory.upgrading);
};

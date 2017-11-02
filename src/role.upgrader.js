var mod = new RoleObj('Upgrader');
module.exports = mod;

mod.Setup = {
    Low: {
        minEnergy: 200,
        essBody: [WORK, CARRY, MOVE],
        extraBody: [],
        prefix: '[Upgrader]',
        memory: {role: 'upgrader'},
    },
    Normal: {
        minEnergy: 300,
        essBody: [WORK, WORK, CARRY, MOVE],
        extraBody: [WORK, WORK, MOVE],
        prefix: '[Upgrader]',
        memory: {role: 'upgrader'},
    },
    High: {
        minEnergy: 300,
        essBody: [WORK, CARRY, MOVE],
        extraBody: [WORK, WORK, MOVE],
        maxExtraAmount: 7, //Up to 15 work parts due to limitation of RCL8
        prefix: '[Upgrader]',
        memory: {role: 'upgrader'},
    },
};

mod.roleConfig = {
    inStack: [Action.Withdraw, Action.Pickup],
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
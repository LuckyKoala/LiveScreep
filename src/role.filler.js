//Haul energy from spawn-container to spawn/container
var mod = new RoleObj('Filler');
module.exports = mod;

mod.Setup = {
    Low: {
        minEnergy: 150,
        essBody: [CARRY, CARRY, MOVE],
        extraBody: [CARRY, CARRY, MOVE],
        maxExtraAmount: 2,
        prefix: '[LowFiller]',
        memory: {role: 'filler'},
    },
    Normal: {
        minEnergy: 400,
        essBody: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
        extraBody: [CARRY, CARRY, MOVE],
        maxExtraAmount: 1,
        prefix: '[Filler]',
        memory: {role: 'filler'},
    },
};

mod.roleConfig = {
    inStack: [Action.Withdraw],
    outStack: [Action.Feed],
};

mod.loop = function(creep) {
    if(creep.memory.filling && creep.carry.energy == 0) {
        creep.memory.filling = false;
        creep.say('🔄 charge');
    }
    if(!creep.memory.filling && creep.carry.energy == creep.carryCapacity) {
        creep.memory.filling = true;
        creep.say('⚡ haul');
    }

    this.loop0(creep, creep.memory.filling);
};

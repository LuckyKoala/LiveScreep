var mod = new SetupObj('Hauler');
module.exports = mod;

mod.setupConfig = {
    Low: {
        minEnergy: 150,
        essBody: [CARRY, CARRY, MOVE],
        extraBody: [CARRY, CARRY, MOVE],
        maxExtraAmount: 1,
        prefix: '[LowHauler]',
        memory: {role: 'hauler'},
    },
    Normal: {
        minEnergy: 450,
        essBody: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        extraBody: [],
        prefix: '[Hauler]',
        memory: {role: 'hauler'},
    },
};

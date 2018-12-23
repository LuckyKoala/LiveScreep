var mod = new SetupObj('Hauler');
module.exports = mod;

mod.setupConfig = {
    Low: {
        minEnergy: 150,
        essBody: [CARRY, CARRY, MOVE],
        extraBody: [CARRY, CARRY, MOVE],
        maxExtraAmount: 1,
        prefix: '[LowHauler]',
        memory: {role: 'Hauler'},
    },
    Normal: {
        minEnergy: 450,
        essBody: [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE],
        extraBody: [CARRY, CARRY, MOVE],
        maxExtraAmount: 2,
        prefix: '[Hauler]',
        memory: {role: 'Hauler'},
    },
};

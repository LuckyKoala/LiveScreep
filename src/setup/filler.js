var mod = new SetupObj('Filler');
module.exports = mod;

mod.setupConfig = {
    Low: {
        minEnergy: 150,
        essBody: [CARRY, CARRY, MOVE],
        extraBody: [CARRY, CARRY, MOVE],
        maxExtraAmount: 1,
        prefix: '[LowFiller]',
        memory: {role: 'Filler'},
    },
    Normal: {
        minEnergy: 300,
        essBody: [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE],
        extraBody: [CARRY, CARRY, MOVE],
        maxExtraAmount: 8,
        prefix: '[Filler]',
        memory: {role: 'Filler'},
    },
};

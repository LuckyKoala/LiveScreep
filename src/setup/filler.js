var mod = new SetupObj('Filler');
module.exports = mod;

mod.setupConfig = {
    Low: {
        minEnergy: 150,
        essBody: [CARRY, CARRY, MOVE],
        extraBody: [CARRY, CARRY, MOVE],
        maxExtraAmount: 1,
        prefix: '[LowFiller]',
        memory: {role: 'filler'},
    },
    Normal: {
        minEnergy: 300,
        essBody: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
        extraBody: [CARRY, CARRY, MOVE],
        maxExtraAmount: 2,
        prefix: '[Filler]',
        memory: {role: 'filler'},
    },
};

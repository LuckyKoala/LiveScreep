var mod = new SetupObj('Reserver');
module.exports = mod;

mod.setupConfig = {
    Normal: {
        minEnergy: 600,
        essBody: [CLAIM, MOVE],
        extraBody: [CLAIM],
        maxExtraAmount: 1,
        prefix: '[Reserver]',
        memory: {role: 'Reserver'},
    },
};

var mod = new SetupObj('Reserver');
module.exports = mod;

mod.setupConfig = {
    Normal: {
        minEnergy: 700,
        essBody: [CLAIM, MOVE, MOVE],
        extraBody: [CLAIM],
        maxExtraAmount: 2,
        prefix: '[Reserver]',
        memory: {role: 'Reserver'},
    },
};

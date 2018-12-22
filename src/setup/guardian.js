var mod = new SetupObj('Guardian');
module.exports = mod;

mod.setupConfig = {
    Normal: {
        minEnergy: 350,
        essBody: [RANGED_ATTACK, RANGED_ATTACK, MOVE],
        extraBody: [],
        maxExtraAmount: 0,
        prefix: '[Guardian]',
        memory: {role: 'guardian'},
    },
};

var mod = new SetupObj('Guardian');
module.exports = mod;

mod.setupConfig = {
    Normal: {
        minEnergy: 210,
        essBody: [ATTACK, ATTACK, MOVE],
        extraBody: [RANGED_ATTACK, RANGED_ATTACK, MOVE],
        maxExtraAmount: 1,
        prefix: '[Guardian]',
        memory: {role: 'guardian'},
    },
};

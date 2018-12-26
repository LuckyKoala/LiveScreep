var mod = new SetupObj(C.GUARDIAN);
module.exports = mod;

mod.setupConfig = {
    Normal: {
        minEnergy: 210,
        essBody: [ATTACK, ATTACK, MOVE],
        extraBody: [RANGED_ATTACK, RANGED_ATTACK, MOVE],
        maxExtraAmount: 1,
        prefix: `[${C.GUARDIAN}]`,
        memory: {role: C.GUARDIAN},
    },
};

var mod = new SetupObj(C.GUARDIAN);
module.exports = mod;

mod.setupConfig = {
    Low: {
        minEnergy: 180,
        essBody: [ATTACK, MOVE, ATTACK, MOVE],
        extraBody: [],
        prefix: `[Low-${C.GUARDIAN}]`,
        memory: {role: C.GUARDIAN},
    },
    Normal: {
        minEnergy: 490,
        essBody: [TOUGH, TOUGH, MOVE, TOUGH, TOUGH, MOVE, TOUGH, ATTACK, MOVE, ATTACK, ATTACK, MOVE],
        extraBody: [RANGED_ATTACK, ATTACK, MOVE],
        maxExtraAmount: 5,
        prefix: `[${C.GUARDIAN}]`,
        memory: {role: C.GUARDIAN},
    },
};

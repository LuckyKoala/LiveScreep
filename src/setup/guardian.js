var mod = new SetupObj(C.GUARDIAN);
module.exports = mod;

mod.setupConfig = {
    Normal: {
        minEnergy: 490,
        essBody: [TOUGH, TOUGH, MOVE, TOUGH, TOUGH, MOVE, TOUGH, ATTACK, MOVE, ATTACK, ATTACK, MOVE],
        extraBody: [RANGED_ATTACK, ATTACK, MOVE],
        maxExtraAmount: 5,
        prefix: `[${C.GUARDIAN}]`,
        memory: {role: C.GUARDIAN},
    },
};

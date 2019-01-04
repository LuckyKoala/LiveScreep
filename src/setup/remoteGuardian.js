var mod = new SetupObj(C.REMOTE_GUARDIAN);
module.exports = mod;

mod.setupConfig = {
    Normal: {
        minEnergy: 490,
        essBody: [TOUGH, TOUGH, MOVE, TOUGH, TOUGH, MOVE, TOUGH, ATTACK, MOVE, ATTACK, ATTACK, MOVE],
        extraBody: [RANGED_ATTACK, ATTACK, MOVE],
        maxExtraAmount: 3,
        prefix: `[${C.REMOTE_GUARDIAN}]`,
        memory: {role: C.REMOTE_GUARDIAN},
    },
};

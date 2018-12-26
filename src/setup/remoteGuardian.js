var mod = new SetupObj(C.REMOTE_GUARDIAN);
module.exports = mod;

mod.setupConfig = {
    Normal: {
        minEnergy: 350,
        essBody: [TOUGH, TOUGH, MOVE, TOUGH, TOUGH, MOVE, ATTACK, ATTACK, MOVE],
        extraBody: [TOUGH, RANGED_ATTACK, MOVE],
        maxExtraAmount: 1,
        prefix: `[${C.REMOTE_GUARDIAN}]`,
        memory: {role: C.REMOTE_GUARDIAN},
    },
};

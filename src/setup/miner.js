var mod = new SetupObj(C.MINER);
module.exports = mod;

mod.setupConfig = {
    Normal: {
        minEnergy: 500,
        essBody: [WORK,WORK,MOVE,WORK,WORK,MOVE],
        extraBody: [WORK, WORK, MOVE],
        maxExtraAmount: 14,
        prefix: `[${C.MINER}]`,
        memory: {role: C.MINER},
    },
};

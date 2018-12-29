var mod = new SetupObj(C.MINER);
module.exports = mod;

mod.setupConfig = {
    Normal: {
        minEnergy: 500,
        essBody: [WORK,WORK,WORK,WORK,MOVE,MOVE],
        extraBody: [WORK, WORK, MOVE],
        maxExtraAmount: 1,
        prefix: `[${C.MINER}]`,
        memory: {role: C.MINER},
    },
};

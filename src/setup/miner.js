var mod = new SetupObj(C.MINER);
module.exports = mod;

mod.setupConfig = {
    Normal: {
        minEnergy: 450,
        essBody: [WORK,WORK,WORK,WORK,MOVE],
        extraBody: [WORK,WORK,WORK,WORK,MOVE],
        maxExtraAmount: 15,
        prefix: `[${C.MINER}]`,
        memory: {role: C.MINER},
    },
};

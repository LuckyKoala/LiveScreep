var mod = new SetupObj(C.RESERVER);
module.exports = mod;

mod.setupConfig = {
    Normal: {
        minEnergy: 700,
        essBody: [CLAIM, MOVE, MOVE],
        extraBody: [CLAIM],
        maxExtraAmount: 2,
        prefix: `[${C.RESERVER}]`,
        memory: {role: C.RESERVER},
    },
};

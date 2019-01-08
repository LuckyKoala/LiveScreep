var mod = new SetupObj(C.RESERVER);
module.exports = mod;

mod.setupConfig = {
    Normal: {
        minEnergy: 650,
        essBody: [CLAIM, MOVE],
        extraBody: [CLAIM, MOVE],
        maxExtraAmount: 2,
        prefix: `[${C.RESERVER}]`,
        memory: {role: C.RESERVER},
    },
};

mod.prespawn = 40;

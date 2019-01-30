var mod = new SetupObj(C.FILLER);
module.exports = mod;

mod.setupConfig = {
    Low: {
        minEnergy: 100,
        essBody: [CARRY, MOVE],
        extraBody: [CARRY, MOVE],
        maxExtraAmount: 1,
        prefix: `[Low${C.FILLER}]`,
        memory: {role: C.FILLER},
    },
    Normal: {
        minEnergy: 300,
        essBody: [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE],
        extraBody: [CARRY, CARRY, MOVE],
        maxExtraAmount: 10,
        prefix: `[${C.FILLER}]`,
        memory: {role: C.FILLER},
    },
};

mod.prespawn = 100;

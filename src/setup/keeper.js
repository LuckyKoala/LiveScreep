var mod = new SetupObj(C.KEEPER);
module.exports = mod;

mod.setupConfig = {
    Normal: {
        minEnergy: 150,
        essBody: [CARRY, CARRY, MOVE],
        extraBody: [CARRY, CARRY, MOVE],
        maxExtraAmount: 11,
        prefix: `[${C.KEEPER}]`,
        memory: {role: C.KEEPER},
    },
};

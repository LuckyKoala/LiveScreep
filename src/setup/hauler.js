var mod = new SetupObj(C.HAULER);
module.exports = mod;

mod.setupConfig = {
    Low: {
        minEnergy: 150,
        essBody: [CARRY, CARRY, MOVE],
        extraBody: [CARRY, CARRY, MOVE],
        maxExtraAmount: 1,
        prefix: `[Low-${C.HAULER}]`,
        memory: {role: C.HAULER},
    },
    Normal: {
        minEnergy: 450,
        essBody: [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE],
        extraBody: [CARRY, CARRY, MOVE],
        maxExtraAmount: 4,
        prefix: `[${C.HAULER}]`,
        memory: {role: C.HAULER},
    },
};

var mod = new SetupObj(C.HAULER);
module.exports = mod;

mod.setupConfig = {
    Low: {
        minEnergy: 100,
        essBody: [CARRY, MOVE],
        extraBody: [CARRY, MOVE],
        maxExtraAmount: 3,
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

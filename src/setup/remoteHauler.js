var mod = new SetupObj(C.REMOTE_HAULER);
module.exports = mod;

mod.setupConfig = {
    Low: {
        minEnergy: 150,
        essBody: [CARRY, CARRY, MOVE],
        extraBody: [CARRY, CARRY, MOVE],
        maxExtraAmount: 1,
        prefix: `[Low-${C.REMOTE_HAULER}]`,
        memory: {role: C.REMOTE_HAULER},
    },
    Normal: {
        minEnergy: 450,
        essBody: [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE],
        extraBody: [CARRY, CARRY, MOVE],
        maxExtraAmount: 8,
        prefix: `[${C.REMOTE_HAULER}]`,
        memory: {role: C.REMOTE_HAULER},
    },
};

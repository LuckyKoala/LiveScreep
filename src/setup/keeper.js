var mod = new SetupObj(C.KEEPER);
module.exports = mod;

mod.setupConfig = {
    Normal: {
        minEnergy: 300,
        essBody: [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE],
        extraBody: [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE],
        prefix: `[${C.KEEPER}]`,
        memory: {role: C.KEEPER},
    },
};

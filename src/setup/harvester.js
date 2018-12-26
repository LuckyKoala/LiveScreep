var mod = new SetupObj(C.HARVESTER);
module.exports = mod;

mod.setupConfig = {
    Low: {
        minEnergy: 250,
        essBody: [WORK,WORK,MOVE],
        extraBody: [],
        prefix: `[Low-${C.HARVESTER}]`,
        memory: {role: C.HARVESTER},
    },
    Normal: {
        minEnergy: 500,
        essBody: [WORK,WORK,WORK,WORK,MOVE,MOVE],
        extraBody: [WORK,CARRY,MOVE],
        maxExtraAmount: 1,
        prefix: `[${C.HARVESTER}]`,
        memory: {role: C.HARVESTER},
    },
};

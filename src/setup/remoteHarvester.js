var mod = new SetupObj(C.REMOTE_HARVESTER);
module.exports = mod;

mod.setupConfig = {
    Low: {
        minEnergy: 250,
        essBody: [WORK,WORK,MOVE],
        extraBody: [],
        prefix: `[Low-${C.REMOTE_HARVESTER}]`,
        memory: {role: C.REMOTE_HARVESTER},
    },
    Normal: {
        minEnergy: 500,
        essBody: [WORK,WORK,MOVE,WORK,WORK,MOVE],
        extraBody: [WORK,WORK,CARRY,CARRY,MOVE],
        maxExtraAmount: 4,
        prefix: `[${C.REMOTE_HARVESTER}]`,
        memory: {role: C.REMOTE_HARVESTER},
    },
};

mod.prespawn = 120;

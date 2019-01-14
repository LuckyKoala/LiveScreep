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
        minEnergy: 550,
        essBody: [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE],
        extraBody: [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE],
        maxExtraAmount: 2,
        prefix: `[${C.REMOTE_HARVESTER}]`,
        memory: {role: C.REMOTE_HARVESTER},
    },
};

mod.prespawn = 130;

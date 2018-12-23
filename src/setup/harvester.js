var mod = new SetupObj('Harvester');
module.exports = mod;

mod.setupConfig = {
    Low: {
        minEnergy: 250,
        essBody: [WORK,WORK,MOVE],
        extraBody: [],
        prefix: '[LowHarvester]',
        memory: {role: 'Harvester'},
    },
    Normal: {
        minEnergy: 500,
        essBody: [WORK,WORK,WORK,WORK,MOVE,MOVE],
        extraBody: [WORK,CARRY,MOVE],
        maxExtraAmount: 1,
        prefix: '[Harvester]',
        memory: {role: 'Harvester'},
    },
};

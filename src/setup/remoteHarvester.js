var mod = new SetupObj('RemoteHarvester');
module.exports = mod;

mod.setupConfig = {
    Low: {
        minEnergy: 250,
        essBody: [WORK,WORK,MOVE],
        extraBody: [],
        prefix: '[LowRHarvester]',
        memory: {role: 'RemoteHarvester'},
    },
    Normal: {
        minEnergy: 500,
        essBody: [WORK,WORK,WORK,WORK,MOVE,MOVE],
        extraBody: [WORK,CARRY,MOVE],
        maxExtraAmount: 1,
        prefix: '[RHarvester]',
        memory: {role: 'RemoteHarvester'},
    },
};

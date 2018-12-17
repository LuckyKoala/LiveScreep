var mod = new SetupObj('Harvester');
module.exports = mod;

mod.setupConfig = {
    Low: {
        minEnergy: 250,
        essBody: [WORK,WORK,MOVE],
        extraBody: [],
        prefix: '[LowHarvester]',
        memory: {role: 'harvester'},
    },
    Normal: {
        minEnergy: 500,
        essBody: [WORK,WORK,WORK,WORK,MOVE,MOVE],
        extraBody: [WORK,CARRY,MOVE],
        maxExtraAmount: 1,
        prefix: '[Harvester]',
        memory: {role: 'harvester'},
    },
};

mod.shouldSpawn = function(room, cnt) {
    const cntLimit = room.energyCapacityAvailable < this.setupConfig.Normal.minEnergy ? 4 : 2; //10 work or 8 work
    const existCount = cnt[lowerFirst(this.setupName)];
    return _.isUndefined(existCount) || existCount < cntLimit;
};

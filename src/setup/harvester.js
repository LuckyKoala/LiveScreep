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
        essBody: [WORK,WORK,WORK,WORK,CARRY,MOVE],
        extraBody: [WORK, MOVE],
        maxExtraAmount: 1,
        prefix: '[Harvester]',
        memory: {role: 'harvester'},
    },
};

mod.shouldSpawn = function(room, cnt) {
    const cntLimit = room.energyCapacityAvailable < 500 ? 4 : 2; //8 work or 8~10 work
    const existCount = cnt[lowerFirst(this.setupName)];
    return _.isUndefined(existCount) || existCount < cntLimit;
};
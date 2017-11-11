var mod = new SetupObj('Harvester');
module.exports = mod;

mod.setupConfig = {
    Low: {
        minEnergy: 300,
        essBody: [WORK,WORK,CARRY,MOVE],
        extraBody: [WORK, MOVE],
        maxExtraAmount: 1,
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
    const existCount = cnt[lowerFirst(this.setupName)];
    return _.isUndefined(existCount) || existCount < 2;
};
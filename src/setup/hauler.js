var mod = new SetupObj('Hauler');
module.exports = mod;

mod.setupConfig = {
    Low: {
        minEnergy: 150,
        essBody: [CARRY, CARRY, MOVE],
        extraBody: [],
        prefix: '[LowHauler]',
        memory: {role: 'hauler'},
    },
    Normal: {
        minEnergy: 450,
        essBody: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        extraBody: [],
        prefix: '[Hauler]',
        memory: {role: 'hauler'},
    },
};

mod.shouldSpawn = function(room, cnt) {
    const cntLimit = room.energyCapacityAvailable < this.setupConfig.Normal.minEnergy ? 2 : 1; //6 carry
    const existCount = cnt[lowerFirst(this.setupName)];
    return _.isUndefined(existCount) || existCount < cntLimit;
};

var mod = new SetupObj('Hauler');
module.exports = mod;

mod.setupConfig = {
    Low: {
        minEnergy: 300,
        essBody: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
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
    const cntLimit = room.energyCapacityAvailable < 450 ? 3 : 2; //12 carry or 12 carry
    const existCount = cnt[lowerFirst(this.setupName)];
    return _.isUndefined(existCount) || existCount < cntLimit;
};
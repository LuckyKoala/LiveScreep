var mod = new SetupObj('Hauler');
module.exports = mod;

mod.setupConfig = {
    Low: {
        minEnergy: 150,
        essBody: [CARRY, CARRY, MOVE],
        extraBody: [CARRY, CARRY, MOVE],
        maxExtraAmount: 2,
        prefix: '[LowHauler]',
        memory: {role: 'hauler'},
    },
    Normal: {
        minEnergy: 400,
        essBody: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
        extraBody: [CARRY, CARRY, MOVE],
        maxExtraAmount: 3, //10Carry => 500Capacity is enough
        prefix: '[Hauler]',
        memory: {role: 'hauler'},
    },
};

mod.shouldSpawn = function(room, cnt) {
    const existCount = cnt[lowerFirst(this.setupName)];
    return _.isUndefined(existCount) || existCount < 1;
};
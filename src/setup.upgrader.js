var mod = new SetupObj('Upgrader');
module.exports = mod;

mod.setupConfig = {
    Low: {
        minEnergy: 200,
        essBody: [WORK, CARRY, MOVE],
        extraBody: [],
        prefix: '[LowUpgrader]',
        memory: {role: 'upgrader'},
    },
    Normal: {
        minEnergy: 300,
        essBody: [WORK, WORK, CARRY, MOVE],
        extraBody: [WORK, WORK, MOVE],
        maxExtraAmount: 4, //10work is enough, only increase it if the storage have more energy
        prefix: '[Upgrader]',
        memory: {role: 'upgrader'},
    },
    High: {
        minEnergy: 300,
        essBody: [WORK, CARRY, MOVE],
        extraBody: [WORK, WORK, MOVE],
        maxExtraAmount: 7, //Up to 15 work parts due to limitation of RCL8
        prefix: '[HighUpgrader]',
        memory: {role: 'upgrader'},
    },
};

mod.shouldSpawn = function(room, cnt) {
    this.rcl = room.controller.level;

    const existCount = cnt[lowerFirst(this.setupName)];
    return _.isUndefined(existCount) || existCount < 1;
};

mod.shouldUseHighLevel = function() {
    return this.rcl == 8;
}
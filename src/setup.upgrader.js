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
        minEnergy: 700,
        essBody: [WORK, WORK, WORK, MOVE, WORK, WORK, WORK, MOVE], //6work
        extraBody: [], //Control by amount of creeps not body limitation
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
    var limit = 2;
    if(room.storage && room.storage.store.energy>60*Thousand && room.energyAvailable>=this.setupConfig.Normal.minEnergy) {
        limit++;
    }
    return _.isUndefined(existCount) || existCount < limit;
};

mod.shouldUseHighLevel = function() {
    return this.rcl == 8;
}
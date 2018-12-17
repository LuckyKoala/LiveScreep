var mod = new SetupObj('Upgrader');
module.exports = mod;

const StorageBoundForAddUpgrader = Config.StorageBoundForAddUpgrader;

mod.setupConfig = {
    Low: {
        minEnergy: 200,
        essBody: [WORK,CARRY,MOVE],
        extraBody: [WORK,CARRY,MOVE],
        maxExtraAmount: 1,
        prefix: '[LowUpgrader]',
        memory: {role: 'upgrader'},
    },
    Normal: {
        minEnergy: 750,
        essBody: [WORK, WORK, WORK, MOVE, WORK, WORK, WORK, MOVE, CARRY], //6work
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
    const existCount = cnt[lowerFirst(this.setupName)];
    var limit = room.energyCapacityAvailable < this.setupConfig.Normal.minEnergy ? 3 : 2; //12 work or 12 work
    
    if(room.storage && room.storage.store.energy>StorageBoundForAddUpgrader && room.energyAvailable>=this.setupConfig.Normal.minEnergy) {
        limit++;
    }

    return _.isUndefined(existCount) || existCount < limit;
};

mod.shouldUseHighLevel = function(room) {
    return room.controller.level == 8;
};

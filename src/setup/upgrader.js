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
        memory: {role: 'Upgrader'},
    },
    Normal: {
        minEnergy: 750,
        essBody: [WORK, WORK, WORK, MOVE, WORK, WORK, WORK, MOVE, CARRY], //6work
        extraBody: [WORK, WORK, WORK, MOVE],
        maxExtraAmount: 2,
        prefix: '[Upgrader]',
        memory: {role: 'Upgrader'},
    },
    High: {
        minEnergy: 300,
        essBody: [WORK, CARRY, MOVE],
        extraBody: [WORK, WORK, MOVE],
        maxExtraAmount: 7, //Up to 15 work parts due to limitation of RCL8
        prefix: '[HighUpgrader]',
        memory: {role: 'Upgrader'},
    },
};

mod.shouldUseHighLevel = function(room) {
    return room.controller.level == 8;
};

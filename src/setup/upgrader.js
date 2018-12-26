var mod = new SetupObj(C.UPGRADER);
module.exports = mod;

mod.setupConfig = {
    Low: {
        minEnergy: 200,
        essBody: [WORK,CARRY,MOVE],
        extraBody: [WORK,CARRY,MOVE],
        maxExtraAmount: 1,
        prefix: `[Low-${C.UPGRADER}]`,
        memory: {role: C.UPGRADER},
    },
    //Let hauler pull upgrader
    Normal: {
        minEnergy: 650,
        essBody: [WORK, WORK, WORK, MOVE, WORK, WORK, CARRY, MOVE], //5work
        extraBody: [WORK, WORK, WORK, MOVE, WORK, WORK, WORK, MOVE], //6work
        maxExtraAmount: 0,
        prefix: `[${C.UPGRADER}]`,
        memory: {role: C.UPGRADER},
    },
    High: {
        minEnergy: 300,
        essBody: [WORK, CARRY],
        extraBody: [WORK, WORK],
        maxExtraAmount: 7, //Up to 15 work parts due to limitation of RCL8
        prefix: `[High-${C.UPGRADER}]`,
        memory: {role: C.UPGRADER},
    },
};

mod.dynamicExtraAmount = function(room) {
    if(room.storage) {
        //Add 6 work will consume 6energy*1400tick = 8400energy
        return Math.floor((room.storage.store[RESOURCE_ENERGY] - Config.StorageBoundForAddUpgrader)/8400);
    } else {
        return 1; //aka 10 work
    }
};

mod.shouldUseHighLevel = function(room) {
    return room.controller.level == 8;
};

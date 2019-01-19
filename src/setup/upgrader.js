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
    Normal: {
        minEnergy: 650,
        //40work 8carry  5*10/11(10tick upgrade 1tick withdraw) :) this one better
        //40work 10carry 4*12/13
        essBody: [WORK, WORK, WORK, MOVE, WORK, WORK, CARRY, MOVE], //5work
        extraBody: [WORK, WORK, WORK, MOVE, WORK, WORK, CARRY, MOVE], //5work
        prefix: `[${C.UPGRADER}]`,
        memory: {role: C.UPGRADER},
    },
    High: {
        minEnergy: 650,
        essBody: [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE], //5work
        extraBody: [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE], //5work
        maxExtraAmount: 2, //Up to 15 work parts due to limitation of RCL8
        prefix: `[High-${C.UPGRADER}]`,
        memory: {role: C.UPGRADER},
    },
};

mod.dynamicExtraAmount = function(room) {
    if(room.storage) {
        //Add 5 work will consume 5energy*10/11tick*1500 = 6818energy
        const amount = Math.floor((room.storage.store[RESOURCE_ENERGY] - Config.StorageBoundForAddUpgrader)/6818);
        return Math.max(0, amount);
    } else {
        return 1; //aka 10 work
    }
};

mod.shouldUseHighLevel = function(room) {
    return room.controller.level == 8;
};

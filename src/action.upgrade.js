let mod = new ActionObj('Upgrade');
module.exports = mod;

mod.nextTarget = function() {
    return this.creep.room.controller;
};

//Only work for controller container exist and it is located at where
//  creep can do withdraw and upgrade at same tick
//Updated: Only withdraw energy if energy remain on creep isn't enough for next action
mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        const controller = target;
        const container = creep.room.controller.container;
        const energyPerAction = UPGRADE_CONTROLLER_POWER*creep.getActiveBodyparts(WORK);
        const energyRemainNextTick = creep.carry.energy - energyPerAction;

        const energyEnoughForAction = energyRemainNextTick >= 0;
        const energyNotEnoughForNextAction = (energyRemainNextTick-energyPerAction) < 0;
        //First we need to be there
        if(creep.pos.inRangeTo(controller, 3)) {
            //And then we need be close to controller container
            if(creep.pos.isNearTo(container)) {
                if(energyNotEnoughForNextAction) {
                    //We need withdraw energy in this tick, because the state of game objects
                    //  only update in next tick
                    creep.withdraw(creep.room.controller.container, RESOURCE_ENERGY);
                }
                if(energyEnoughForAction) {
                    creep.upgradeController(controller);
                }
            } else {
                creep.moveTo(container);
            }
        } else {
            if(energyEnoughForAction) {
                creep.upgradeController(controller);
            }
            creep.moveTo(controller);
        }
    });
};
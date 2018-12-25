let mod = new ActionObj('ComplexUpgrade');
module.exports = mod;

mod.nextTarget = function() {
    return this.creep.room.controller;
};

mod.word = '⚙️ Xupgrade';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        const controller = target;
        const container = creep.room.controller.container;
        const energyPerAction = UPGRADE_CONTROLLER_POWER*creep.getActiveBodyparts(WORK);
        const energyRemainNextTick = creep.carry.energy - energyPerAction;

        const energyEnoughForAction = energyRemainNextTick >= 0;
        const energyNotEnoughForNextAction = (energyRemainNextTick-energyPerAction) < 0;
        let moved = false;
        let worked = false;

        if(creep.pos.isNearTo(container)) {
            //Maintain container
            if(container.hits < container.hitsMax) {
                creep.repair(container);
                Util.Stat.incEnergyOut(creep.room.name, creep.getActiveBodyparts(WORK)*REPAIR_POWER*REPAIR_COST);
                worked = true;
            }
        }
        //We need more energy!
        if(energyNotEnoughForNextAction) {
            if(creep.pos.isNearTo(container)) {
                //We can do withdraw and upgrade at same tick now!
                //We need withdraw energy in this tick, because the state of game objects
                //  only update in next tick
                creep.withdraw(creep.room.controller.container, RESOURCE_ENERGY);
            } else {
                creep.moveTo(container);
                moved = true;
            }
        }

        //First we need to be there
        if(creep.pos.inRangeTo(controller, 3)) {
            if(!worked && energyEnoughForAction) {
                if(creep.upgradeController(controller) === OK) {
                    Util.Stat.incEnergyOut(creep.room.name, creep.getActiveBodyparts(WORK)*UPGRADE_CONTROLLER_POWER);
                }
            }
        } else {
            if(moved) {
                //I am on the way to get energy already!
            } else {
                creep.moveTo(controller);
            }
        }
    });
};

let mod = new ActionObj('Upgrade');
module.exports = mod;

mod.nextTarget = function() {
    return this.creep.room.controller;
};

mod.word = '⚙️ upgrade';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        const container = creep.room.controller.container;
        if(container && container.hits < container.hitsMax && creep.pos.inRangeTo(container, 1)) {
            creep.say('🚧 repair');
            const result = creep.repair(container);
            if(result === OK) {
                Util.Stat.incEnergyOut(creep.room.name, creep.getActiveBodyparts(WORK)*REPAIR_POWER*REPAIR_COST);
            }
            return;
        }

        const result = creep.upgradeController(target);
        if(result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        } else if(result == ERR_INVALID_TARGET && target.upgradeBlocked > 0) {
            //Still goes there in case not to occupy container
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        } else if(result === OK) {
            Util.Stat.incEnergyOut(creep.room.name, creep.getActiveBodyparts(WORK)*UPGRADE_CONTROLLER_POWER);
        }
    });
};

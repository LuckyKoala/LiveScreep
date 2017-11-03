let mod = new ActionObj('Withdraw');
module.exports = mod;
//Should mark
const targetInitFunc = function(creep) {
    const role = creep.memory.role;
    const findSuitableContainer = function(o) { 
        if(o.structureType == STRUCTURE_CONTAINER || o.structureType == STRUCTURE_STORAGE) {
            var need = creep.carryCapacity - creep.carry.energy;
            if(o.store[RESOURCE_ENERGY] > need) {
                return true;
            }
        }
        return false;
    };
    const suitableContainers = creep.room.find(FIND_STRUCTURES, {
        filter: findSuitableContainer
    });
    const controllerContainer = creep.room.controller.container;

    if(role == 'upgrader') {
        return controllerContainer;
    } else if(role == 'hauler') {
        //Hauler shouldn't withdraw energy from container/storage which is used by upgrader
        // which will make hauler trapped in withdraw-transfer loop due to action.put is also
        // used by hauler.
        var targets = suitableContainers;
        const controllerContainerId = controllerContainer.id;
        if(controllerContainer) {
            targets = _.filter(targets, o => o.id != controllerContainerId);
        } 
        return creep.pos.findClosestByRange(targets);
    } else if(role == 'filler') {
        const spawnLink = creep.room.spawnLink;
        if(spawnLink && spawnLink.energy>0) {
            return spawnLink;
        } else {
            return creep.room.storage;
        }
    } else {
        return creep.pos.findClosestByRange(suitableContainers);
    }
};

mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, targetInitFunc, this.actionName);
};

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        const result = creep.withdraw(target, RESOURCE_ENERGY);
        if(result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
        } else if(result == OK || result == ERR_NOT_ENOUGH_RESOURCES) {
            Util.Mark.unmarkTarget(creep, this.actionName);
        }
    });
};
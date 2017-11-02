let mod = new ActionObj('Withdraw');
module.exports = mod;
//Haul energy from container
//Should mark
mod.nextTarget = function() {
    const creep = this.creep;
    const role = creep.memory.role;
    var targets;
    var findEnoughContainer = function(o) { 
        if(o.structureType == STRUCTURE_CONTAINER || o.structureType == STRUCTURE_STORAGE) {
            var need = creep.carryCapacity - creep.carry.energy;
            if(o.store[RESOURCE_ENERGY] > need) {
                return true;
            }
        }
        return false;
    };
    const nearControllerContainers = creep.room.controller.pos.findInRange(FIND_STRUCTURES, 4, {
        filter: findEnoughContainer
    });
    const nearControllerContainerIds = _.map(nearControllerContainers, function(o) {
        return o.id;
    });

    if(role == 'upgrader') {
        //Near controller container/storage
        targets =  nearControllerContainers;
        //Should not let upgrader to retrieve energy itself 
        return targets.length == 0 ? false : targets[0];
    } else if(role == 'hauler') {
        //Hauler shouldn't withdraw energy from container/storage which is near controller
        return creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function(o) { 
                if(o.structureType == STRUCTURE_CONTAINER || o.structureType == STRUCTURE_STORAGE) {
                    var need = creep.carryCapacity - creep.carry.energy;
                    if(o.store[RESOURCE_ENERGY] > need) {
                        return _.indexOf(nearControllerContainerIds, o.id) == -1; //Not near controller
                    }
                }
                return false;
            }
        });
    } else {
        return creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: findEnoughContainer
        });
    }
};

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    });
};
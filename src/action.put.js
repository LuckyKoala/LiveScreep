let mod = new ActionObj('Put');
module.exports = mod;

mod.nextTarget = function() {
    const creep = this.creep;
    const role = creep.memory.role;
    var targets;
    const findNotFullContainer = function(o) {
        if(o.structureType == STRUCTURE_CONTAINER || o.structureType == STRUCTURE_STORAGE) {
            if(o.store[RESOURCE_ENERGY] < o.storeCapacity) {
                return true;
            }
        }
        return false;
    };
    const nearSourceContainers = creep.pos.findInRange(FIND_STRUCTURES, 2, {
        filter: findNotFullContainer
    });
    const nearSourceContainerIds = _.map(nearSourceContainers, function(o) {
        return o.id;
    });
    
    if(role == 'harvester') {
        //Near source container/storage
        return nearSourceContainers[0];
    } else {
        //Find near controller container/storage first
        targets = creep.room.controller.pos.findInRange(FIND_STRUCTURES, 5, {
            filter: findNotFullContainer
        });
        //Then find others
        //Other roles shouldn't put energy to container/storage which is near source
        if(targets.length == 0) {
            return creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(o) {
                    if(o.structureType == STRUCTURE_CONTAINER || o.structureType == STRUCTURE_STORAGE) {
                        if(o.store[RESOURCE_ENERGY] < o.storeCapacity) {
                            return _.indexOf(nearSourceContainerIds, o.id) == -1; //Not near source
                        }
                    }
                    return false;
                }
            });
        } else {
            return targets[0];
        }
    } 
};
//Override
mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        //Maintain container first
        //So result is creep will harvest -> repair util
        // container hits equal to hitsMax.
        if(target.hits < target.hitsMax && creep.getActiveBodyparts(WORK) > 0) {
            creep.say('🚧 repair');
            if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    });
};

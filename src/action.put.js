let mod = new ActionObj('Put');
module.exports = mod;

mod.nextTarget = function() {
    const creep = this.creep;
    const role = creep.memory.role;
    var targets;
    
    if(role == 'harvester') {
        //Near source container/storage
        targets = creep.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: function(o) {
                return o.structureType == STRUCTURE_CONTAINER || o.structureType == STRUCTURE_STORAGE;
            }
        });
    } else if(role == 'hauler') {
        //Near controller container/storage
        targets = creep.room.controller.pos.findInRange(FIND_STRUCTURES, 4, {
            filter: function(o) {
                return o.structureType == STRUCTURE_CONTAINER || o.structureType == STRUCTURE_STORAGE;
            }
        });
    }

    return targets.length>0 ? targets[0] : false; //Other role will not use this action
};
//Override
mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        //Maintain container first
        //So result is creep will harvest -> repair util
        // container hits equal to hitsMax.
        if(target.hits < target.hitsMax) {
            creep.say('🚧 repair');
            if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    });
};

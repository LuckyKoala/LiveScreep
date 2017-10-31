let mod = new ActionObj('Withdraw');
module.exports = mod;
//Haul energy from container
mod.nextTarget = function() {
    const creep = this.creep;
    const role = creep.memory.role;
    var targets;

    if(role == 'upgrader') {
        //Near controller container/storage
        targets =  creep.room.controller.pos.findInRange(FIND_STRUCTURES, 4, {
            filter: function(o) {
                return (o.structureType == STRUCTURE_CONTAINER || 
                    o.structureType == STRUCTURE_STORAGE);
            }
        });
        //If there is no any container/storage nearby, go find others!
        if(targets.length == 0) {
            return creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(o) { 
                    if(o.structureType == STRUCTURE_CONTAINER || o.structureType == STRUCTURE_STORAGE) {
                        var need = creep.carryCapacity - creep.carry.energy;
                        if(o.store[RESOURCE_ENERGY] > need) {
                            //Should match with Marker
                            return true;
                        }
                    }
                    return false;
                }
            });
        } else {
            return targets[0];
        }
    } else {
        return creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function(o) { 
                if(o.structureType == STRUCTURE_CONTAINER || o.structureType == STRUCTURE_STORAGE) {
                    var need = creep.carryCapacity - creep.carry.energy;
                    if(o.store[RESOURCE_ENERGY] > need) {
                        //Should match with Marker
                        return true;
                    }
                }
                return false;
            }
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
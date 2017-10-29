let mod = new ActionObj('Withdraw');
module.exports = mod;
//Haul energy from container
mod.nextTarget = function() {
    var creep = this.creep; //For filter closure (this)
    var targets = this.creep.room.find(FIND_STRUCTURES, {
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
    return targets.length>0 ? targets[0] : false;
};

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    });
};
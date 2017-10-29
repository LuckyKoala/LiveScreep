let mod = new ActionObj('Feed');
module.exports = mod;

mod.nextTarget = function() {
    var targets = this.creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                structure.energy < structure.energyCapacity;
        }
    });
    return targets.length>0 ? targets[0] : false;
};

mod.loop = function(creep) {
    this.creep = creep;
    var target = this.nextTarget();
    if(target) {
        if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
};
let mod = new ActionObj('Feed');
module.exports = mod;

mod.nextTarget = function() {
    var targets = this.creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_TOWER) &&
                structure.energy < 3/10*structure.energyCapacity; //300
        }
    });
    return targets.length>0 ? targets[0] : false;
};

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    });
};
let mod = new ActionObj('Feed');
module.exports = mod;

mod.nextTarget = function() {
    return this.creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_TOWER) &&
                structure.energy < Util.Tower.getRequireEnergyAmount(); 
        }
    });
};

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    });
};
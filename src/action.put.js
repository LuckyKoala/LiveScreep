let mod = new ActionObj('Put');
module.exports = mod;

mod.nextTarget = function() {
    var targets = this.creep.room.find(FIND_STRUCTURES, {
        filter: { structureType: STRUCTURE_CONTAINER }
    });
    return targets.length>0 ? targets[0] : false;
};
//Override
mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    });
};

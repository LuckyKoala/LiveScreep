let task = new TaskObj('Put');
module.exports = task;

task.nextTarget = function() {
    var targets = this.creep.room.find(FIND_STRUCTURES, {
        filter: { structureType: STRUCTURE_CONTAINER }
    });
    return targets.length>0 ? targets[0] : false;
};

task.loop = function(creep) {
    this.creep = creep;
    var target = this.nextTarget();
    if(target) {
        if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
};

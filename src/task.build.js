let task = new TaskObj('Build');
module.exports = task;

task.nextTarget = function() {
    var targets = this.creep.room.find(FIND_CONSTRUCTION_SITES);
    return targets.length>0 ? targets[0] : false;
};

task.loop = function(creep) {
    this.creep = creep;
    var target = this.nextTarget();
    if(target) {
        if(creep.build(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
};
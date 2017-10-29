let task = new TaskObj();
module.exports = task;

task.nextTarget = function() {
    return this.creep.room.controller;
};

task.loop = function(creep) {
    this.creep = creep;
    var target = this.nextTarget();
    if(creep.upgradeController(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
    }
};
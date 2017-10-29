let task = new TaskObj();
module.exports = task;
//Haul energy from container
task.nextTarget = function() {
    var targets = this.creep.room.find(FIND_MY_STRUCTURES, {
        filter: function(o) { 
            if(o.structureType == STRUCTURE_CONTAIENR) {
                var need = this.creep.carryCapacity - this.creep.carry.energy;
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

task.loop = function(creep) {
    this.creep = creep;
    var target = this.nextTarget();
    if(target) {
        if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
};
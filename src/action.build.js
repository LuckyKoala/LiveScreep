let mod = new ActionObj('Build');
module.exports = mod;

mod.nextTarget = function() {
    var targets = this.creep.room.find(FIND_CONSTRUCTION_SITES);
    return targets.length>0 ? targets[0] : false;
};

mod.loop = function(creep) {
    this.creep = creep;
    var target = this.nextTarget();
    if(target) {
        if(creep.build(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
};
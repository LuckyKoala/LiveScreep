let mod = new ActionObj('Pickup');
module.exports = mod;

mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, creep => {
        const remainCapacity = creep.carryCapacity - _.sum(creep.carry);
        return creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, o => o.amount >= remainCapacity);
    }, this.actionName);
};

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        const result = creep.pickup(target);
        if(result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
        } else if(result == OK) {
            Util.Mark.unmarkTarget(creep, this.actionName);
        }
    });
};
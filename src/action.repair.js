let mod = new ActionObj('Repair');
module.exports = mod;

//TODO Order by priority and range
mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, creep => creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES), this.actionName);
};

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        const result = creep.build(target);
        if(result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        } else if(result == OK) {
            Util.Mark.unmarkTarget(creep, this.actionName);
        }
    });
};
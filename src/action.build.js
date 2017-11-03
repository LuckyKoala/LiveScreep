let mod = new ActionObj('Build');
module.exports = mod;

//TODO Order by priority and range
mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, creep => {
        return creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
            filter: function(o) {
                return o.structureType!=STRUCTURE_RAMPART;
            }
        });
    }, this.actionName);
};

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        //console.log('Loop build action whose target is '+JSON.stringify(target));
        const result = creep.build(target);
        if(result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        } else if(result == OK) {
            Util.Mark.unmarkTarget(creep, this.actionName);
        }
    });
};
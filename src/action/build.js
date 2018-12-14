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

mod.word = '🚧 build';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        //console.log('Loop build action whose target is '+JSON.stringify(target));
        const result = creep.build(target);
        if(result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        } else if(result == OK) {
            //Only unmark if the structure will be finished in next tick,
            //  so creep will not search for other sites while it has unfinished target
            const finish = (target.progressTotal - target.progress - creep.getActiveBodyparts(WORK)*BUILD_POWER) == 0;
            if(finish) Util.Mark.unmarkTarget(creep, this.actionName);
        }
    });
};

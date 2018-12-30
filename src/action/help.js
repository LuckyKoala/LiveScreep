let mod = new ActionObj('Help');
module.exports = mod;

const targetInitFunc = function(creep) {
    if(creep.room.storage) return false;
    const needBuildStructures = creep.room.cachedFind(FIND_CONSTRUCTION_SITES);
    if(needBuildStructures.length===0) return false;
    const builders = _.filter(creep.room.cachedFind(FIND_MY_CREEPS), c => c.memory.role === C.BUILDER && _.sum(c.carry)<1/2*c.carryCapacity);
    return builders.length>0 ? creep.pos.findClosestByRange(builders) : false;
};
mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, targetInitFunc, this.actionName);
};

mod.word = '➡︎ help';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        const result = creep.transfer(target, RESOURCE_ENERGY);
        if(result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
        } else {
            Util.Mark.unmarkTarget(creep, this.actionName);
        }
    });
};

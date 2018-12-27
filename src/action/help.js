let mod = new ActionObj('Help');
module.exports = mod;

const targetInitFunc = function(creep) {
    if(creep.room.storage) return false;
    const needBuildStructures = creep.room.cachedFind(FIND_CONSTRUCTION_SITES);
    const builders = _.filter(creep.room.cachedFind(FIND_MY_CREEPS), c => c.memory.role === C.BUILDER && _.sum(c.carry)<c.carryCapacity);
    return needBuildStructures.length>0 && builders.length>0 ? builders[0] : false;
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
        }
    });
};

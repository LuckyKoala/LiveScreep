let mod = new ActionObj('PutForUpgrade');
module.exports = mod;

const targetInitFunc = function(creep) {
    const container = creep.room.controller.container;
    if(container) {
        if((container.storeCapacity-container.store[RESOURCE_ENERGY]) >= creep.carry[RESOURCE_ENERGY]) return container;
        else return false;
    } else {
        const upgraders = _.filter(creep.room.cachedFind(FIND_MY_CREEPS), c => c.memory.role === C.UPGRADER && _.sum(c.carry)<c.carryCapacity);
        return upgraders.length>0 ? upgraders[0] : false;
    }
};

mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, targetInitFunc, this.actionName);
};

mod.word = '➡︎ putUp';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        const result = creep.transfer(target, RESOURCE_ENERGY);
        if(result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
        } else if(result == OK || result == ERR_FULL) {
            Util.Mark.unmarkTarget(creep, this.actionName);
        }
    });
};

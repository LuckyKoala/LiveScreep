let mod = new ActionObj('PutToKeeper');
module.exports = mod;

const targetInitFunc = function(creep) {
    if(creep.carry[RESOURCE_ENERGY] === 0) return false;
    const keepers = _.filter(creep.room.cachedFind(FIND_MY_CREEPS), c => c.memory.role === C.KEEPER);
    if(keepers.length>0) {
        return keepers[0];
    } else {
        return false;
    }
};

mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, targetInitFunc, this.actionName, validateFunc);
};

const validateFunc = function(creep, target) {
    if(!target.room || target.room.name!==creep.room.name) return false;
    const carryRemain = _.sum(creep.carry);
    return (target.carryCapacity-_.sum(target.carry)) >= carryRemain;
};

mod.word = '➡︎ Keeper';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        const result = creep.transfer(target, RESOURCE_ENERGY);
        if(result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    });
};

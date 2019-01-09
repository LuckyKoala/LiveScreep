let mod = new ActionObj('PutToLink');
module.exports = mod;

const targetInitFunc = function(creep) {
    const sourceLinks = creep.room.sourceLinks;
    for(const sourceLink of sourceLinks) {
        if(validateFunc(creep, sourceLink)) {
            return sourceLink;
        }
    }
    return false;
};

const validateFunc = function(creep, target) {
    return creep.pos.getRangeTo(target)<=2 && target.energy<target.energyCapacity;
};

mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, targetInitFunc, this.actionName, validateFunc);
};

mod.word = '➡︎ put';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        const result = creep.transfer(target, RESOURCE_ENERGY);
        if(result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
        //No need to unmark, it is only using by stationary harvester
        // unless target is not valid
        if(result == ERR_INVALID_TARGET) {
            Util.Mark.unmarkTarget(creep, this.actionName);
        }
    });
};

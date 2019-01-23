let mod = new ActionObj('PutToLink');
module.exports = mod;

const targetInitFunc = function(creep) {
    const links = creep.room.links;
    for(const link of links) {
        if(validateFunc(creep, link)) {
            return link;
        }
    }
    return false;
};

const validateFunc = function(creep, target) {
    return creep.pos.getRangeTo(target)<=6 && target.energy<target.energyCapacity;
};

mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, targetInitFunc, this.actionName, validateFunc);
};

mod.word = '➡︎ toLink';

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

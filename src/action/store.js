let mod = new ActionObj('Store');
module.exports = mod;

const targetInitFunc = function(creep) {
    return creep.room.storage || false;
};

mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, targetInitFunc, this.actionName);
};

mod.word = '➡︎ store';

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

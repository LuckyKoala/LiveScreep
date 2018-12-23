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
        // store all resources
        let result;
        for(const resourceType in creep.carry) {
            result = creep.transfer(target, resourceType);
        }
        if(result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
        } else if(result == OK) {
            if(_.sum(creep.carry) > 0) {
                //So there may be resource remain
            } else {
                Util.Mark.unmarkTarget(creep, this.actionName);
            }
        } else if(result == ERR_FULL) {
            Util.Mark.unmarkTarget(creep, this.actionName);
        }
    });
};

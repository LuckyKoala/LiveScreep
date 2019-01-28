let mod = new ActionObj('PutToTerminal');
module.exports = mod;

const targetInitFunc = function(creep) {
    const terminal = Game.rooms[creep.memory.homeRoom].terminal;
    if(terminal && validateFunc(creep, terminal)) return terminal;
    else return false;
};

mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, targetInitFunc, this.actionName, validateFunc);
};

const validateFunc = function(creep, target) {
    if(!target.room || target.room.name!==creep.room.name) return false;
    const carryRemain = _.sum(creep.carry);
    return (target.storeCapacity-_.sum(target.store)) >= carryRemain;
};

mod.word = '➡︎ Terminal';

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
        }
    });
};

let mod = new ActionObj('Store');
module.exports = mod;

const targetInitFunc = function(creep) {
    const storage = Game.rooms[creep.memory.homeRoom].storage;
    const terminal = Game.rooms[creep.memory.homeRoom].terminal;
    if(storage && _.sum(storage.store)<storage.storeCapacity) {
        return storage;
    } else if(terminal && _.sum(terminal.store)<terminal.storeCapacity) {
        return terminal;
    } else {
        const keepers = _.filter(creep.room.cachedFind(FIND_MY_CREEPS), c => c.memory.role === C.KEEPER);
        if(keepers.length>0) {
            return keepers[0];
        } else {
            return false;
        }
    }
};

mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, targetInitFunc, this.actionName, validateFunc);
};

const validateFunc = function(creep, target) {
    if(!target.room || target.room.name!==creep.room.name) return false;
    const carryRemain = _.sum(creep.carry);
    if(target.store) {
        return (target.storeCapacity-_.sum(target.store)) >= carryRemain;
    } else if(target.carry) {
        return (target.carryCapacity-_.sum(target.carry)) >= carryRemain;
    } else {
        return false;
    }
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

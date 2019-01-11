let mod = new ActionObj('FromTombstone');
module.exports = mod;

const targetInitFunc = function(creep) {
    const tombstones = _.filter(creep.room.cachedFind(FIND_TOMBSTONES), t => _.sum(t.store)>0);
    if(tombstones.length>0) return tombstones[0];
    else return false;
};

mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, targetInitFunc, this.actionName, validateFunc);
};

const validateFunc = function(creep, target) {
    return target.room && target.room.name===creep.room.name && _.sum(target.store) > 0;
};

mod.word = '⬅︎Tombstone';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        let result = OK;
        if(creep.memory.role===C.HAULER || creep.memory.role===C.REMOTE_HAULER) {
            //Only haulers are allowed to get resources other than energy
            if(target.store) {
                for(const resourceType in target.store) {
                    result = creep.withdraw(target, resourceType);
                }
            } else {
                result = creep.withdraw(target, RESOURCE_ENERGY);
            }
        } else {
            result = creep.withdraw(target, RESOURCE_ENERGY);
        }
        if(result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {range: 1, maxRooms: 1, visualizePathStyle: {stroke: '#ffaa00'}});
        }
    });
};

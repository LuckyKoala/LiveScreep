let mod = new ActionObj('FromStorage');
module.exports = mod;

const targetInitFunc = function(creep) {
    const role = creep.memory.role;
    const storage = creep.room.storage;
    if(role === C.FILLER) {
        return storage;
    } else if(storage && storage.store[RESOURCE_ENERGY]>Config.StorageBoundForSpawn) {
        return storage;
    } else {
        return false;
    }
};

mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, targetInitFunc, this.actionName, validateFunc);
};

mod.word = '⬅︎Storage';

const validateFunc = function(creep, target) {
    return target.room && target.room.name === creep.room.name && _.sum(target.store)>0;
};

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        const result = creep.withdraw(target, RESOURCE_ENERGY);
        if(result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {range: 1, maxRooms: 1, visualizePathStyle: {stroke: '#ffaa00'}});
        }
    });
};

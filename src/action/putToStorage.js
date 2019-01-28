let mod = new ActionObj('PutToStorage');
module.exports = mod;

const targetInitFunc = function(creep) {
    const storage = Game.rooms[creep.memory.homeRoom].storage;
    if(validateFunc(creep, storage)) return storage;
    else return false;
};

mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, targetInitFunc, this.actionName, validateFunc);
};

const validateFunc = function(creep, target) {
    if(!target.room || target.room.name!==creep.room.name) return false;
    const carryRemain = creep.carry[RESOURCE_ENERGY];
    const capacityRemain = target.storeCapacity-_.sum(target.store);
    return target.store[RESOURCE_ENERGY]<Config.StorageReserveForEnergy && (capacityRemain-carryRemain)>=0;
};

mod.word = '➡︎ Storage';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        // store all resources
        let result;
        for(const resourceType in creep.carry) {
            result = creep.transfer(target, resourceType);
        }
        if(result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    });
};

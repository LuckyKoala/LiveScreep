let mod = new ActionObj('FromTerminal');
module.exports = mod;

const targetInitFunc = function(creep) {
    const role = creep.memory.role;
    const terminal = creep.room.terminal;
    const hasEnoughEnergy = terminal && (terminal.store[RESOURCE_ENERGY]-(creep.carryCapacity-creep.carry.energy))>=0;

    if(hasEnoughEnergy) {
        if(creep.room.storage) return terminal;
        else {
            //No storage, so terminal is main storage now, we need to reserve some energy for spawn
            if(role === C.FILLER) {
                return terminal;
            } else if(terminal && terminal.store[RESOURCE_ENERGY]>Config.StorageBoundForSpawn) {
                //creeps other than filler should honour the StorageBoundForSpawn
                return terminal;
            }
        }
    }
    return false;
};

mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, targetInitFunc, this.actionName, validateFunc);
};

mod.word = '⬅︎Terminal';

const validateFunc = function(creep, target) {
    const hasEnoughEnergy = target && (target.store[RESOURCE_ENERGY]-(creep.carryCapacity-creep.carry.energy))>=0;
    if(!creep.room.storage && creep.memory.role!==C.FILLER && target.store[RESOURCE_ENERGY]<=Config.StorageBoundForSpawn) return false;
    return target.room && target.room.name === creep.room.name && hasEnoughEnergy;
};

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        const result = creep.withdraw(target, RESOURCE_ENERGY);
        if(result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {range: 1, maxRooms: 1, visualizePathStyle: {stroke: '#ffaa00'}});
        }
    });
};

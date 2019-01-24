let mod = new ActionObj('Fuel');
module.exports = mod;

mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, creep => {
        return creep.pos.findClosestByRange(creep.room.cachedFind(FIND_MY_STRUCTURES), {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_TOWER) &&
                    structure.energy < structure.energyCapacity;
            }
        });
    }, this.actionName, validateFunc);
};

mod.word = '🕯︎ fuel';

const validateFunc = function(creep, target) {
    return target.room && target.room.name === creep.room.name && target.energy!==target.energyCapacity;
};

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        const result = creep.transfer(target, RESOURCE_ENERGY);
        if(result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {range: 1, maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
        }
    });
};

let mod = new ActionObj('Fuel');
module.exports = mod;

mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, creep => {
        return creep.pos.findClosestByRange(creep.room.cachedFind(FIND_MY_STRUCTURES), {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_TOWER) &&
                    structure.energy < Config.EnergyForDefend;
            }
        });
    }, this.actionName);
};

mod.word = '🕯︎ fuel';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        const result = creep.transfer(target, RESOURCE_ENERGY);
        if(result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        } else if(result == OK) {
            Util.Mark.unmarkTarget(creep, this.actionName);
        }
    });
};

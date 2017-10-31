let mod = new ActionObj('Feed');
module.exports = mod;

mod.nextTarget = function() {
    const creep = this.creep;
    var targetId = Util.Mark.getMarkTarget(creep);

    if(!targetId) {
        const target = this.creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                    structure.energy < structure.energyCapacity;
            }
        });
        if(!target) return false;
        targetId = target.id;
        Util.Mark.markTarget(creep, targetId);
    }
    return Game.getObjectById(targetId);
};

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        const result = creep.transfer(target, RESOURCE_ENERGY);
        if(result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        } else if(result == OK) {
            Util.Mark.unmarkTarget(creep);
        }
    });
};
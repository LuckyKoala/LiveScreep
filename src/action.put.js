let mod = new ActionObj('Put');
module.exports = mod;

//TODO consider storage
mod.nextTarget = function() {
    return this.creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: { structureType: STRUCTURE_CONTAINER }
    });
};
//Override
mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        //Maintain container first
        //So result is creep will harvest -> repair util
        // container hits equal to hitsMax.
        if(target.hits < target.hitsMax) {
            creep.say('🚧 repair');
            if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    });
};

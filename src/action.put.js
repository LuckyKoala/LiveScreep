let mod = new ActionObj('Put');
module.exports = mod;

//TODO diff put target to two module
//  one for store energy whose priority is low
//  one for put energy to controller container 
//    which is using by upgrader whose priority is normal
mod.nextTarget = function() {
    const creep = this.creep;
    const role = creep.memory.role;
    const findSuitableContainer = function(o) {
        if(o.structureType == STRUCTURE_CONTAINER || o.structureType == STRUCTURE_STORAGE) {
            if(_.sum(o.store) < o.storeCapacity) {
                return true;
            }
        }
        return false;
    };
    const suitableContainers = creep.room.find(FIND_STRUCTURES, {
        filter: findSuitableContainer
    });
    
    if(role == 'harvester') {
        var markSource = Util.Mark.getMarkSource(creep);
        return markSource ? markSource.container : false;
    } else {
        const sourceContainers = [];
        for(var id in Memory.sources) {
            const source = Game.getObjectById(id);
            if(source && source.container) {
                sourceContainers.push(source.container);
            }
        }
        var targets = suitableContainers;
        if(sourceContainers.length) {
            const sourceContainerIds = _.map(sourceContainers, o => o.id);
            targets = _.filter(targets, o => _.indexOf(sourceContainerIds, o.id) == -1);
        } 
        return creep.pos.findClosestByRange(targets);
    } 
};
//Override
mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        //Maintain container first
        //So result is creep will harvest -> repair util
        // container hits equal to hitsMax.
        if(target.hits < target.hitsMax && creep.getActiveBodyparts(WORK) > 0) {
            creep.say('🚧 repair');
            if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    });
};

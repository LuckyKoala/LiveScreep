let mod = new ActionObj('Put');
module.exports = mod;

//Warning: if you put more than one container near source,
//  hauler will be in infinite loop of withdraw/transfer.

//TODO diff put target to two module
//  one for store energy whose priority is low
//  one for put energy to controller container 
//    which is using by upgrader whose priority is normal
const targetInitFunc = function(creep) {
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
        const sourceLink = creep.room.sourceLink;
        if(sourceLink && creep.pos.getRangeTo(sourceLink)<=2 
           && sourceLink.energy<sourceLink.energyCapacity) {
            return sourceLink;
        } else {
            const markSource = Util.Mark.getMarkSource(creep);
            return markSource ? markSource.container : false;
        }
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

mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, targetInitFunc, this.actionName);
}

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        //Maintain container first(Only for harvester which is stay still)
        //So result is creep will harvest -> repair util
        // container hits equal to hitsMax.
        
        if(target.hits < target.hitsMax && creep.getActiveBodyparts(WORK) > 0 && creep.memory.role=='harvester') {
            creep.say('🚧 repair');
            if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            const result = creep.transfer(target, RESOURCE_ENERGY);
            if(result == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
            } else if(result == OK) {
                Util.Mark.unmarkTarget(creep, this.actionName);
            }
        }
    });
};

let mod = new ActionObj('Withdraw');
module.exports = mod;

function findTargetForHauler(creep, suitableContainers) {
    //Hauler shouldn't withdraw energy from container/storage which is used by upgrader
    // which will make hauler trapped in withdraw-transfer loop due to action.put is also
    // used by hauler.
    const controllerContainer = creep.room.controller.container;
    var targets = suitableContainers;
    if(controllerContainer) {
        targets = _.filter(targets, o => o.id != controllerContainer.id);
    };
    return creep.pos.findClosestByRange(targets);
}

function findTargetForFiller(creep) {
    const spawnLink = creep.room.spawnLink;
    const sourceLink = creep.room.sourceLink;
    if(spawnLink) {
        //Only target spawnLink when it has enough energy or else abandon this target, try next action
        if(sourceLink && sourceLink.energy==sourceLink.energyCapacity) {
            //SourceLink is ready to transfer energy, so filler should move all the remain energy
            //  in SpawnLink as soon as it can.
            creep.memory.skipBefore = 0;
            return spawnLink;
        } else {
            if(spawnLink.energy > (creep.carryCapacity-creep.carry.energy)) {
                creep.memory.skipBefore = 0;
                return spawnLink;
            } else {
                if(_.isUndefined(creep.memory.skipBefore)) creep.memory.skipBefore=0;
                //If SourceLink is not ready and SpawnLink don't have enough energy, try next action once
                //Memorize it skip spawnLink
                const skipBefore = creep.memory.skipBefore;
                if(skipBefore && spawnLink.energy>0) {
                    //We have skip spawnLink at least one times, so we will target it as long
                    //  as it has any energy
                    creep.memory.skipBefore = 0;
                    return spawnLink;
                } else {
                    creep.memory.skipBefore++;
                    return false;
                }
            }
        }
    } else {
        return creep.room.storage;
    }
}

const targetInitFunc = function(creep) {
    const role = creep.memory.role;
    const suitableContainers = creep.room.find(FIND_STRUCTURES, {
        filter: function(o) { 
            if(o.structureType == STRUCTURE_CONTAINER || o.structureType == STRUCTURE_STORAGE) {
                var need = creep.carryCapacity - creep.carry.energy;
                if(o.store[RESOURCE_ENERGY] > need) {
                    return true;
                }
            }
            return false;
        }
    });
    
    if(role == 'hauler') {
        return findTargetForHauler(creep, suitableContainers);
    } else if(role == 'filler') {
        return findTargetForFiller(creep);
    } else {
        return creep.pos.findClosestByRange(suitableContainers);
    }
};

mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, targetInitFunc, this.actionName);
};

mod.word = '⬅︎ withdraw';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        const result = creep.withdraw(target, RESOURCE_ENERGY);
        if(result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
        } else if(result == OK || result == ERR_NOT_ENOUGH_RESOURCES) {
            Util.Mark.unmarkTarget(creep, this.actionName);
        }
    });
};

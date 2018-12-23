let mod = new ActionObj('Withdraw');
module.exports = mod;

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

const findSourceContainers = function(creep) {
    for(let source of creep.room.sources) {
        const need = creep.carryCapacity - creep.carry.energy;
        const container = source.container || false;
        if(container && container.store[RESOURCE_ENERGY] > need) {
            return container;
        }
    }
    return false;
};

const targetInitFunc = function(creep) {
    const role = creep.memory.role;
    if(role === 'Hauler') {
        //Only find source container
        return findSourceContainers(creep);
    } else if(role === 'Filler') {
        return findTargetForFiller(creep);
    } else if(role === 'Builder') {
        const storage = creep.room.storage;
        if(storage) {
            return storage;
        } else {
            return findSourceContainers(creep);
        }
    } else if(role === 'Upgrader') {
        const container = creep.room.controller.container;
        if(container) {
            return container;
        } else {
            return findSourceContainers(creep);
        }
    } else {
        console.log(`error while ${creep.name} using withdraw action`);
        return false;
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

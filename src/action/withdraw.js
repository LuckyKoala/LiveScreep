let mod = new ActionObj('Withdraw');
module.exports = mod;

function findTargetForFiller(creep) {
    const spawnLink = creep.room.spawnLink;
    if(spawnLink && spawnLink.energy > 0) {
        //SourceLink only transfer energy when no energy remain in spawnLink
        //  so filler should move all the remain energy in SpawnLink ASAP.
        //Otherwise it will block link between source-link and spawn-link
        return spawnLink;
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
    if(role === 'Hauler' || role==='RemoteHauler') {
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
        //Prefer controllerLink
        const link = creep.room.controllerLink;
        if(link && link.energy > 0) {
            return link;
        }

        const container = creep.room.controller.container;
        if(container) {
            return container;
        } else {
            return findSourceContainers(creep);
        }
    } else {
        console.log(`Can't find target while ${creep.name} using withdraw action`);
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

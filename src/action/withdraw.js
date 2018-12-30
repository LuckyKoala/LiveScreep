let mod = new ActionObj('Withdraw');
module.exports = mod;

const targetInitFunc = function(creep) {
    const role = creep.memory.role;
    if(role === C.HAULER || role === C.REMOTE_HAULER || role === C.PIONEER) {
        const tombstones = _.filter(creep.room.cachedFind(FIND_TOMBSTONES), t => _.sum(t.store)>0);
        if(tombstones.length>0) return tombstones[0];

        const need = creep.carryCapacity - creep.carry.energy;
        //Find source container
        for(let source of creep.room.sources) {
            const container = source.container || false;
            if(container && container.store[RESOURCE_ENERGY] >= need) {
                return container;
            }
        }
        //Find mineral container
        const mineral = creep.room.mineral;
        if(mineral && mineral.container && _.sum(mineral.container.store)>=need) {
            return mineral.container;
        }
        return false;
    } else if(role === C.FILLER) {
        const tombstones = _.filter(creep.room.cachedFind(FIND_TOMBSTONES), t => t.store[RESOURCE_ENERGY]>0);
        if(tombstones.length>0) return tombstones[0];
        const spawnLink = creep.room.spawnLink;
        if(spawnLink && spawnLink.energy > 0) {
            //SourceLink only transfer energy when no energy remain in spawnLink
            //  so filler should move all the remain energy in SpawnLink ASAP.
            //Otherwise it will block link between source-link and spawn-link
            return spawnLink;
        } else {
            return creep.room.storage;
        }
    } else if(role === C.BUILDER) {
        const storage = creep.room.storage;
        if(storage) {
            return storage;
        } else if(creep.room.controller.level<3 && creep.room.controller.container) {
            //If low rcl, we treat controller container as storage
            return creep.room.controller.container;
        } else {
            return false;
        }
    } else if(role === C.KEEPER) {
        const storage = creep.room.storage;
        if(storage) {
            return storage;
        } else {
            return false;
        }
    } else if(role === C.UPGRADER) {
        //Prefer controllerLink
        const link = creep.room.controllerLink;
        if(link && link.energy > 0) {
            return link;
        }

        const container = creep.room.controller.container;
        if(container) {
            return container;
        } else {
            return false;
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
        let result = OK;
        if(creep.memory.role===C.HAULER || creep.memory.role===C.REMOTE_HAULER) {
            //Only haulers are allowed to get resources other than energy
            for(const resourceType in target.store) {
                result = creep.withdraw(target, resourceType);
            }
        } else {
            result = creep.withdraw(target, RESOURCE_ENERGY);
        }
        if(result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
        } else if(result == OK || result == ERR_NOT_ENOUGH_RESOURCES) {
            Util.Mark.unmarkTarget(creep, this.actionName);
        }
    });
};

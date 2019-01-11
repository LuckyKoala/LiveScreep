let mod = new ActionObj('FromContainer');
module.exports = mod;

const targetInitFunc = function(creep) {
    const need = creep.carryCapacity - creep.carry.energy;
    const role = creep.memory.role;
    const room = creep.room;
    if(role === C.UPGRADER && room.controller.container && room.controller.container.store[RESOURCE_ENERGY]>need) {
        return room.controller.container;
    }
    //Find source container
    for(let source of room.sources) {
        const container = source.container || false;
        if(container && container.store[RESOURCE_ENERGY] >= need) {
            return container;
        }
    }
    if(role === C.HAULER || role === C.REMOTE_HAULER) {
        //Find mineral container
        const mineral = room.mineral;
        if(mineral && mineral.container && _.sum(mineral.container.store)>=need) {
            return mineral.container;
        }
    }

    return false;
};

mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, targetInitFunc, this.actionName, validateFunc);
};

const validateFunc = function(creep, target) {
    const need = creep.carryCapacity - creep.carry.energy;
    return target.room && target.room.name===creep.room.name && _.sum(target.store) > need;
};

mod.word = '⬅︎Container';

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
            creep.moveTo(target, {range: 1, maxRooms: 1, visualizePathStyle: {stroke: '#ffaa00'}});
        }
    });
};

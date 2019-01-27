let mod = new ActionObj('FromLink');
module.exports = mod;

const targetInitFunc = function(creep) {
    const links = creep.room.links;
    for(const link of links) {
        if(validateFunc(creep, link)) {
            return link;
        }
    }
    return false;
};

mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, targetInitFunc, this.actionName, validateFunc);
};

const validateFunc = function(creep, target) {
    if(!target.room || target.room.name!==creep.room.name || target.energy===0) return false;
    if(creep.memory.role===C.UPGRADER) {
        return target.memory.type === 'controller';
    } else if(creep.room.storage.store[RESOURCE_ENERGY] < Config.StorageBoundForSpawn) {
        //If energy remain in storage is too few, let filler drain energy from controller link too
        return target.memory.type==='controller' || target.memory.type==='center';
    } else {
        const controllerLinkIsFull = creep.room.links.filter(link => link.memory.type==='controller' && link.energy===0).length === 0;
        return controllerLinkIsFull && target.memory.type==='center';
    }
};

mod.word = '⬅︎Link';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        const result = creep.withdraw(target, RESOURCE_ENERGY);
        if(result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {range: 1, maxRooms: 1, visualizePathStyle: {stroke: '#ffaa00'}});
        }
    });
};

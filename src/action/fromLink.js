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
    } else {
        return target.memory.type === 'center';
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

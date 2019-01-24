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
    return creep.pos.getRangeTo(target)<=6 && target.room && target.room.name===creep.room.name && target.energy>0;
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

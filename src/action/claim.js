let mod = new ActionObj('Claim');
module.exports = mod;

mod.nextTarget = function() {
    const creep = this.creep;
    if(creep.room.controller && !creep.room.controller.my) {
        return creep.room.controller;
    } else {
        return false;
    }
};

mod.word = '🕵︎ Claim';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        const result = creep.claimController(target);
        if(result === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        } else if(result === OK) {
            //Controller ownership update
            delete creep.room.memory.roomType;
        }
    });
};

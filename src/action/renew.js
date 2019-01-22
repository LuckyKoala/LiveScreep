let mod = new ActionObj('Renew');
module.exports = mod;

mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, creep => {
        if(creep.ticksToLive < 500) {
            const spawns = creep.room.spawns.filter(spawn => !spawn.spawning);
            if(spawns.length>0) return spawns[0];
        }
        return false;
    }, this.actionName, validateFunc);
};

const validateFunc = function(creep, target) {
    const ticksToLiveLimit = creep.getActiveBodyparts(CLAIM)>0 ? 520 : 1420;
    return target.room && target.room.name === creep.room.name && !target.spawning && creep.ticksToLive<ticksToLiveLimit;
};

mod.word = '🕵︎ Renew';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        const result = target.renewCreep(creep);
        if(result === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {range: 1, maxRooms: 1});
        } else if(result === OK) {
            //Do nothing
        }
    });
};

let mod = new ActionObj('FromLink');
module.exports = mod;

const targetInitFunc = function(creep) {
    const role = creep.memory.role;
    if(role === C.UPGRADER) {
        const link = creep.room.controllerLink;
        if(link && link.energy > 0) {
            return link;
        }
    } else {
        const spawnLink = creep.room.spawnLink;
        if(spawnLink && spawnLink.energy > 0) {
            //SourceLink only transfer energy when no energy remain in spawnLink
            //  so filler should move all the remain energy in SpawnLink ASAP.
            //Otherwise it will block link between source-link and spawn-link
            return spawnLink;
        }
    }

    return false;
};

mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, targetInitFunc, this.actionName, validateFunc);
};

const validateFunc = function(creep, target) {
    return target.room && target.room.name===creep.room.name && target.energy>0;
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

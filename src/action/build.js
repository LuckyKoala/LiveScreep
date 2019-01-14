let mod = new ActionObj('Build');
module.exports = mod;

mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, creep => {
        return creep.pos.findClosestByRange(creep.room.cachedFind(FIND_CONSTRUCTION_SITES), {
            filter: function(o) {
                return o.structureType!=STRUCTURE_RAMPART;
            }
        });
    }, this.actionName, validateFunc);
};

mod.word = '🚧 build';

const validateFunc = function(creep, target) {
    return target.room && target.room.name === creep.room.name;
};

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        const result = creep.build(target);
        if(result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {range: 3, maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
        } else if(result == OK) {
            Util.Stat.incEnergyOut(creep.room.name, creep.getActiveBodyparts(WORK)*BUILD_POWER);
            //Only unmark if the structure will be finished in next tick,
            //  so creep will not search for other sites while it has unfinished target
            const finish = (target.progressTotal - target.progress - creep.getActiveBodyparts(WORK)*BUILD_POWER) == 0;
            if(finish) {
                Util.Mark.unmarkTarget(creep, this.actionName);

                if(target.structureType===STRUCTURE_LINK) {
                    creep.room.saveLinks();
                }
            }
        }
    });
};

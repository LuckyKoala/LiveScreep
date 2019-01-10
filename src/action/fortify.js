let mod = new ActionObj('Fortify');
module.exports = mod;

mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, creep => {
        const walls = _.sortBy(_.filter(creep.room.cachedFind(FIND_STRUCTURES), function(o) {
            return o.structureType==STRUCTURE_RAMPART || o.structureType==STRUCTURE_WALL;
        }), o=>o.hits);

        const lastMaxHits = creep.memory.maxHits || 0;
        let maxHits = lastMaxHits;
        if(lastMaxHits === 0) {
            maxHits = 300*Thousand;
            creep.memory.maxHits = Math.min(maxHits, Config.WallMaxHits);
        }

        if(walls.length>0) {
            const target = walls[0];
            if(!validateFunc(creep, target)) {
                //time to raise maxHits
                const newMaxHits = creep.memory.maxHits + 1*Thousand;
                creep.memory.maxHits = Math.min(newMaxHits, Config.WallMaxHits);
            }

            return target;
        }
    }, this.actionName, validateFunc);
};

const validateFunc = function(creep, target) {
    return target.hits<creep.memory.maxHits;
};

mod.word = '🚧 fortify';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        if(creep.pos.inRangeTo(target, 3)) {
            creep.repair(target);
        } else {
            creep.moveTo(target, {maxRooms: 1, range: 3, visualizePathStyle: {stroke: '#ffffff'}});
        }
    });
};

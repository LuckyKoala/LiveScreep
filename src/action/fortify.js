let mod = new ActionObj('Fortify');
module.exports = mod;

mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, creep => {
        const walls = _.sortBy(creep.room.cachedFind(FIND_STRUCTURES).filter(function(o) {
            return o.structureType==STRUCTURE_RAMPART;
        }), o=>o.hits);

        const lastMaxHits = creep.memory.maxHits || 0;
        let maxHits = lastMaxHits;
        if(lastMaxHits === 0) {
            maxHits = 300*Thousand;
            creep.memory.maxHits = Math.min(maxHits, Config.WallMaxHits);
        }

        if(walls.length>0) {
            const target = walls[0];
            if(target.hits >= creep.memory.maxHits) {
                //time to raise maxHits
                const newMaxHits = creep.memory.maxHits + 50*Thousand;
                creep.memory.maxHits = Math.min(newMaxHits, Config.WallMaxHits);
            }

            return target;
        } else {
            return false;
        }
    }, this.actionName, validateFunc);
};

const validateFunc = function(creep, target) {
    //15K extra hits for decay cost while fortify ramparts of whole room
    return target.room && target.room.name===creep.room.name && target.hits<(creep.memory.maxHits+15*Thousand);
};

mod.word = '🚧 fortify';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        if(creep.pos.inRangeTo(target, 3)) {
            creep.repair(target);
            creep.room.visual.text(`Lowest hits of rampart: ${target.hits}`, 8, 8, {color: 'red', font: 1});
        } else {
            creep.moveTo(target, {maxRooms: 1, range: 3, visualizePathStyle: {stroke: '#ffffff'}});
        }
    });
};

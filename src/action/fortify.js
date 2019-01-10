let mod = new ActionObj('Fortify');
module.exports = mod;

//30M is enough
const MAXHITS = 30*Thousand*Thousand;

mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, creep => {
        const walls = _.filter(creep.room.cachedFind(FIND_STRUCTURES), function(o) {
            return o.structureType==STRUCTURE_RAMPART || o.structureType==STRUCTURE_WALL;
        });

        const lastMaxHits = creep.memory.maxHits || 0;
        let maxHits = lastMaxHits;
        if(lastMaxHits === 0) {
            maxHits = _.max(_.map(walls, wall => wall.hits));
            creep.memory.maxHits = maxHits;
        }

        const lowWalls = _.filter(walls, wall=>wall.hits<maxHits);
        if(lowWalls.length>0) {
            return creep.pos.findClosestByRange(lowWalls);
        } else {
            //time to raise maxHits
            const newMaxHits = creep.memory.maxHits + 1*Thousand;
            creep.memory.maxHits = Math.min(newMaxHits, MAXHITS);
            return false;
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
            creep.moveTo(target, {range: 3, visualizePathStyle: {stroke: '#ffffff'}});
        }
    });
};

let mod = new ActionObj('Fortify');
module.exports = mod;

mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, creep => {
        if(creep.memory.maxHits===undefined) creep.memory.maxHits = Math.min(600*Thousand, Config.WallMaxHits);

        let rampart = _.find(creep.room.cachedFind(FIND_MY_STRUCTURES), function(o) {
            return o.structureType===STRUCTURE_RAMPART && o.hits<creep.memory.maxHits;
        });

        if(rampart) return rampart;
        else {
            //Increase maxHits
            creep.memory.maxHits = Math.min(maxHits+60*Thousand, Config.WallMaxHits);
            rampart = _.find(creep.room.cachedFind(FIND_MY_STRUCTURES), function(o) {
                return o.structureType==STRUCTURE_RAMPART && o.hits<creep.memory.maxHits;
            });
            if(rampart) return rampart;
            else return false;
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

let mod = new ActionObj('Mine');
module.exports = mod;

mod.nextTarget = function() {
    const creep = this.creep;
    const mineral = creep.room.mineral;
    if(mineral.extractor) return mineral;
    else return false;
};

mod.word = '⛏ mine';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        if(target.extractor.cooldown > 0) return;
        if(target.mineralAmount===0) {
            Logger.info(`Recycling miner ${creep.name} due to empty mineral`);
            creep.memory.role=C.RECYCLER;
        }
        if(target.container) {
            //Try stay above the container
            if(creep.pos.isEqualTo(target.container)) {
                creep.harvest(target);
            } else {
                creep.moveTo(target.container, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            if(creep.pos.isNearTo(target)) {
                creep.harvest(target);
            } else {
                creep.moveTo(target, {range: 1, visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    });
};


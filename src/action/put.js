let mod = new ActionObj('Put');
module.exports = mod;

//Warning: if you put more than one container near source,
//  hauler will be in infinite loop of withdraw/transfer.
const targetInitFunc = function(creep) {
    //Try link mining first
    const sourceLink = creep.room.sourceLink;
    if(sourceLink && creep.pos.getRangeTo(sourceLink)<=2
       && sourceLink.energy<sourceLink.energyCapacity) {
        return sourceLink;
    } else {
        //Fallback to container mining
        const markSource = Util.SourceMark.getMarkSource(creep);
        return markSource ? markSource.container : false;
    }
};

mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, targetInitFunc, this.actionName);
};

mod.word = '➡︎ put';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        //Maintain container/link first(Only for harvester which is stay still)
        //So result is creep will harvest -> repair util
        // container hits equal to hitsMax.
        if(target.hits < target.hitsMax) {
            creep.say('🚧 repair');
            const result = creep.repair(target);
            if(result === OK) {
                Util.Stat.incEnergyOut(creep.room.name, creep.getActiveBodyparts(WORK)*REPAIR_POWER*REPAIR_COST);
            } else if(result === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            const result = creep.transfer(target, RESOURCE_ENERGY);
            if(result == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
            } else if(result == OK || result == ERR_FULL) {
                Util.Mark.unmarkTarget(creep, this.actionName);
            }
        }
    });
};

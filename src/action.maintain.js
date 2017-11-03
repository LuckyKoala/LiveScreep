let mod = new ActionObj('Maintain');
module.exports = mod;

//Build rampart maintain it to threshold
mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, creep => {
        var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
            filter: { structureType: STRUCTURE_RAMPART }
        });
        if(!target) {
            return creep.pos.findClosestByRange(Util.War.getRampartsForMaintain(creep.room));
        } else {
            return target;
        }
    }, this.actionName);
};

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        //console.log('Loop maintain action whose target is '+JSON.stringify(target));
        if(_.isUndefined(target.progress)) {
            const result = creep.repair(target);
            if(result == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            } else if(result == OK && Util.War.canReleaseRampart(target.hits)) {
                Util.Mark.unmarkTarget(creep, this.actionName);
            }
        } else {
            //Then it is constructionSite
            const result = creep.build(target);
            if(result == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            } else if(result == OK) {
                //Not to unmark it, so next tick it will be maintain to normal threshold
                //Util.Mark.unmarkTarget(creep, this.actionName);
            }
        }
    });
};
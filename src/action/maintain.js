let mod = new ActionObj('Maintain');
module.exports = mod;

//Build rampart maintain it to threshold
mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, creep => {
        //Maintain first
        const target = creep.pos.findClosestByRange(Util.Defense.getRampartsForMaintain(creep.room));
        if(!target) {
            return creep.pos.findClosestByRange(Util.Defense.getRampartSitesCanBuild(creep.room, creep.carry.energy));
        } else {
            return target;
        }
    }, this.actionName);
};

mod.word = '🚧 maintain';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        if(_.isUndefined(target.progress)) {
            const result = creep.repair(target);
            if(result == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            } else if(result == OK && Util.Defense.canReleaseRampart(target.hits)) {
                Util.Mark.unmarkTarget(creep, this.actionName);
            }
        } else {
            //Then it is constructionSite
            const result = creep.build(target);
            if(result == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            } else if(result == OK) {
                Util.Stat.incEnergyOut(creep.room.name, creep.getActiveBodyparts(WORK)*REPAIR_POWER*REPAIR_COST);
                //Not to unmark it, so next tick it will be maintain to normal threshold
                //Util.Mark.unmarkTarget(creep, this.actionName);
            }
        }
    });
};

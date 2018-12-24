let mod = new ActionObj('Dismantle');
module.exports = mod;

mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, creep => {
        const flag = this.creep.pos.findClosestByRange(creep.room.cachedFind(FIND_FLAGS), {
            filter: o => FlagUtil.dismantle.examine(o)
        });
        if(flag) {
            const structures = flag.pos.lookFor(LOOK_STRUCTURES);
            if(structures.length > 0) {
                return structures[0];
            } else {
                flag.remove(); //Remove flag since there is no structures to dismantle
                return false;
            }
        }
        return false;
    }, this.actionName);

};

mod.word = '🚧 dismantle';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        const result = creep.dismantle(target);
        if(result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        } else if(result == OK) {
            Util.Stat.incEnergyIn(creep.room.name, creep.getActiveBodyparts(WORK)*DISMANTLE_POWER*DISMANTLE_COST);
        }
    });
};

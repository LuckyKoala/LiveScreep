let mod = new ActionObj('Recycle');
module.exports = mod;

mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, creep => {
        return creep.pos.findClosestByRange(creep.room.spawns);
    }, this.actionName);
};

mod.word = '♻︎ recycle';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        if(target.recycleCreep(creep) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
        //There is no need to unmark since the creep is died, its memory will be cleared.
    });
};

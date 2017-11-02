let mod = new ActionObj('Upgrade');
module.exports = mod;

mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, creep => creep.room.controller, this.actionName);
};

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        const result = creep.upgradeController(target);
        if(result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        } else if(result == OK) {
            Util.Mark.unmarkTarget(creep, this.actionName);
        }
    });
};
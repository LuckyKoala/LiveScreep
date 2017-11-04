let mod = new ActionObj('Guard');
module.exports = mod;

mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, creep => {
        const sortHostiles = Util.Defense.getSortedHostiles(creep);
        return sortHostiles.length ?
        　　Game.getObjectById(_.last(sortHostiles).id) : false;
    }, this.actionName);
};

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        if(creep.attack(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
        //TODO maybe destory all the attack part and then change target?
    });
};
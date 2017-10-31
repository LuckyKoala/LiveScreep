let mod = new ActionObj('Guard');
module.exports = mod;

mod.nextTarget = function() {
    var creep = this.creep;
    const sortHostiles = Util.War.getgetSortedHostiles(creep);
    if(sortHostiles.length) {
        return Game.getObjectById(_.last(sortHostiles).id);
    } else {
        return false;
    }
};

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        if(creep.attack(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    });
};
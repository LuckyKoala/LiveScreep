let mod = new ActionObj('Guard');
module.exports = mod;

mod.nextTarget = function() {
    const creep = this.creep;
    const sortHostiles = Util.Defense.sortHostilesByPos(creep.room, creep.pos);
    return sortHostiles.length ?
    　　Game.getObjectById(_.last(sortHostiles).id) : false;
};

mod.word = '🛡 guard';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        creep.attack(target);
    });
};

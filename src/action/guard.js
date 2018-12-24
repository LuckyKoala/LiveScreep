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
        //Respect rampart
        const rampart = target.pos.findClosestByRange(creep.room.cachedFind(FIND_MY_STRUCTURES),{
            filter: { structureType: STRUCTURE_RAMPART }
        });
        if(rampart) {
            creep.moveTo(rampart, {visualizePathStyle: {stroke: '#ffffff'}});
        } else {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }

        if(creep.pos.inRangeTo(target, 3)) {
            const hostiles = creep.pos.findInRange(creep.room.cachedFind(FIND_HOSTILE_CREEPS), 2);
            if(hostiles > 3) {
                creep.rangedMassAttack();
            } else {
                if(creep.pos.inRangeTo(target, 1)) {
                    creep.attack(target);
                } else {
                    creep.rangedAttack(target);
                }
            }
        }
    });
};

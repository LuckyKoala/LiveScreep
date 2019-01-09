let mod = new ActionObj('Guard');
module.exports = mod;

mod.nextTarget = function() {
    const creep = this.creep;
    if(creep.hits<150) return false; //flee!

    if(creep.room.memory.underAttack) {
        const sortHostiles = Util.Defense.sortHostilesByPos(creep.room, creep.pos);
        if(sortHostiles.length > 0) {
            return Game.getObjectById(_.last(sortHostiles).id);
        }
    }

    return false;
};

mod.word = '🛡 guard';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        if(creep.room.memory.underAttack) {
            let moved = false;
            if(creep.room.name===creep.memory.homeRoom) {
                //Respect rampart
                const rampart = target.pos.findClosestByRange(creep.room.cachedFind(FIND_MY_STRUCTURES),{
                    filter: { structureType: STRUCTURE_RAMPART }
                });
                if(rampart) {
                    creep.moveTo(rampart, {visualizePathStyle: {stroke: '#ffffff'}});
                    moved = true;
                }
            }
            if(!moved) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }

            if(creep.pos.inRangeTo(target, 3)) {
                const hostiles = creep.pos.findInRange(creep.room.cachedFind(FIND_HOSTILE_CREEPS), 2);
                if(hostiles.length > 3) {
                    creep.rangedMassAttack();
                } else {
                    if(creep.pos.inRangeTo(target, 1)) {
                        creep.attack(target);
                    } else {
                        creep.rangedAttack(target);
                    }
                }
            }
        }
    });
};

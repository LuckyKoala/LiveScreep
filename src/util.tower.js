//Tower logic goes there
var mod = {};
module.exports = mod;

mod.loop = function(room) {
    //Check whether energy available is enough for next action
    var towers = room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_TOWER) &&
                structure.energy > 10;
        }
    });
    _.forEach(towers, function(tower) {
        //Kill invader
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
            return;
        }
        //Repair structure
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_CONTAINER
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
            return;
        }
        //Heal creep
        var closestInjuredCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: (creep) => creep.hits < creep.hitsMax
        });
        if(closestInjuredCreep) {
            tower.heal(closestInjuredCreep);
            return;
        }
    });
}
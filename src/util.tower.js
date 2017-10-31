//Tower logic goes there
var mod = {};
module.exports = mod;

const containerMaintainThreshold = 80000; //80K

mod.loop = function(room) {
    //Check whether energy available is enough for next action
    var towers = room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_TOWER) &&
                structure.energy > 10;
        }
    });
    this.towers = towers;
    _.forEach(towers, function(tower) {
        //Kill invader
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
            return;
        }
        //Repair structure
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                if(structure.hits < structure.hitsMax) {
                    if(structure.structureType == STRUCTURE_CONTAINER) {
                        return structure.hits < containerMaintainThreshold;
                    } 
                    return true;
                }
            }
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
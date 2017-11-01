//Tower logic goes there
var mod = {};
module.exports = mod;

const ConstructureMaintainThreshold = {
    container: 80000, //80K
};
const EnergyForDefend = 300;
const RequireEnergyAmount = 500;

mod.getRequireEnergyAmount = function() {
    return RequireEnergyAmount;
} 

mod.loop = function(room) {
    //Check whether energy available is enough for next action
    var towers = room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_TOWER) &&
                structure.energy >= TOWER_ENERGY_COST;
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
        if(tower.energy <= EnergyForDefend) return; //Save energy for defend 
        //Heal creep
        var closestInjuredCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: (creep) => creep.hits < creep.hitsMax
        });
        if(closestInjuredCreep) {
            tower.heal(closestInjuredCreep);
            return;
        }
        //Repair structure
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                if(structure.hits < structure.hitsMax) {
                    if(structure.structureType == STRUCTURE_CONTAINER) {
                        return structure.hits < ConstructureMaintainThreshold[STRUCTURE_CONTAINER];
                    } else if(structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) {
                        return false;
                    }
                    return true;
                }
            }
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
            return;
        }
    });
}
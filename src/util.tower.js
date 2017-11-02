//Tower logic goes there
var mod = {};
module.exports = mod;

const ConstructureMaintainThreshold = {
    container: 80000, //80K
};
mod.EnergyForDefend = 300;
const RequireEnergyToal = 500;

//FIXME Go use oop or else 'this' can be wrong reference!
mod.getCurrentEnergyRequiredForEachTower = function(room) {
    if(this.towers.length == 0) return 0;
    return RequireEnergyToal/this.towers.length;
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
        if(tower.energy <= this.EnergyForDefend) return; //Save energy for defend 
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
//Tower logic goes there
var mod = {};
module.exports = mod;

const ConstructureMaintainThreshold = {
    container: 80000, //80K
};

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
        var sortHostiles = Util.Defense.sortHostilesByPos(room, tower.pos);
        const hostile = sortHostiles.length ?
        　　Game.getObjectById(_.last(sortHostiles).id) : false;
        if(hostile) {
            tower.attack(hostile);
            return;
        }

        if(tower.energy <= Config.EnergyForDefend) return; //Save energy for defend 
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
                const flags = structure.pos.lookFor(LOOK_FLAGS);
                if(flags) {
                    const dismantleFlagFound = _.filter(flags, o => FlagUtil.dismantle.examine(o)).length;
                   if(dismantleFlagFound) return false;
                }
                if(structure.hits < structure.hitsMax) {
                    if(structure.structureType == STRUCTURE_CONTAINER) {
                        return structure.hits < ConstructureMaintainThreshold[STRUCTURE_CONTAINER];
                    } else if(structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) {
                        return false;
                    } else if(structure.structureType == STRUCTURE_ROAD) {
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
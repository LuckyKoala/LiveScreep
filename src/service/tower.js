//Tower logic goes there
var mod = {};
module.exports = mod;

const ConstructureMaintainThreshold = {
    container: 80000, //80K
};

mod.loop = function(room) {

    //Check whether energy available is enough for next action
    const towers = _.filter(room.cachedFind(FIND_MY_STRUCTURES), (structure) => {
        return (structure.structureType == STRUCTURE_TOWER) &&
            structure.energy >= TOWER_ENERGY_COST;
    });
    this.towers = towers;
    _.forEach(towers, function(tower) {
        if(room.memory.underAttack) {
            //Kill invader
            var sortHostiles = Util.Defense.sortHostilesByPos(room, tower.pos);
            if(sortHostiles.length) {
                //TODO Do not attack creeps too far away
                //  make workers flee
                //  make guardian forward
                //const hostileObj = _.last(_.filter(sortHostiles, (hostile) => hostile.range <= 2*TOWER_OPTIMAL_RANGE));
                const hostileObj = _.last(sortHostiles);
                if(hostileObj) {
                    const hostile = Game.getObjectById(hostileObj.id);
                    if(hostile) {
                        if(tower.attack(hostile) === OK) {
                            Util.Stat.incEnergyOut(tower.room.name, TOWER_ENERGY_COST);
                        }
                        return;
                    }
                }
            }
        }

        //Heal creep
        const closestInjuredCreeps = _.filter(room.cachedFind(FIND_MY_CREEPS), (creep) => creep.hits < creep.hitsMax);
        if(closestInjuredCreeps.length > 0) {
            if(tower.heal(closestInjuredCreeps[0]) === OK) {
                Util.Stat.incEnergyOut(tower.room.name, TOWER_ENERGY_COST);
            }
            return;
        }

        if(tower.energy <= Config.EnergyForDefend) return; //Save energy for defend

        const lastRepairCheck = room.memory.lastRepairCheck || 0;

        if((Game.time - lastRepairCheck) > 200) {
            room.memory.lastRepairCheck = Game.time;
            //Repair structure
            const closestDamagedStructure = tower.pos.findClosestByRange(room.cachedFind(FIND_STRUCTURES), {
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
                    } else {
                        return false;
                    }
                }
            });
            if(closestDamagedStructure) {
                if(tower.repair(closestDamagedStructure) === OK) {
                    Util.Stat.incEnergyOut(tower.room.name, TOWER_ENERGY_COST);
                }
                return;
            }
        }
    });
}

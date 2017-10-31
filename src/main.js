var _global = require('global');
var _extension = require('extension');

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

const CARRY_TO_ENERGY_POWER = 1; //hardcode
const MAXIUM_ENERGY_GENERATE_PER_TICK = 2*SOURCE_ENERGY_CAPACITY/ENERGY_REGEN_TIME; //Currently 20

var mod = {};
module.exports = mod;
mod.loop = function () {
    const startCpu = Game.cpu.getUsed();

    Util.GC.loop();
    Util.Mark.loop();
    Util.Stat.loop();

    var cnt = {
        total: 0,
        harvester: 0,
        upgrader: 0,
        builder: 0,
        hauler: 0,
        guardian: 0,
    }
    var energyInPerTick = 0;
    var energyOutPerTick = 0;

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        var role = creep.memory.role;
        var roleModule = Role[_.capitalize(role)];
        _.set(cnt, role, _.get(cnt, role, 0)+1); //_.update(cnt, role, function(n) { return n ? n + 1 : 0; });
        cnt['total']++;
        
        if(roleModule) {
            if(role == "harvester") {
                //Kind of hardcode (Only test harvester in)
                energyInPerTick += creep.getActiveBodyparts(WORK) * HARVEST_POWER;
            } else if(role == "builder") {
                energyOutPerTick += creep.getActiveBodyparts(WORK) * BUILD_POWER;
            } else if(role == "upgrader") {
                energyOutPerTick += creep.getActiveBodyparts(WORK) * UPGRADE_CONTROLLER_POWER;
            } else if(role == "hauler") {
                energyOutPerTick += creep.getActiveBodyparts(CARRY) * CARRY_TO_ENERGY_POWER;
            }

            roleModule.loop(creep);
        } else {
            console.log('[Error] Undefined role module is in memory of creep -> '+name);
        }
    }
    
    Util.Stat.memorize('last-energyInPerTick', energyInPerTick);
    Util.Stat.memorize('last-energyOutPerTick', energyOutPerTick);
    Util.Stat.memorize('last-creeps-cnt', cnt);

    const needExtraHarvester = energyInPerTick < energyOutPerTick 
                       && energyInPerTick < MAXIUM_ENERGY_GENERATE_PER_TICK;
    
    //FIXME cnt is not pair with every room
    var entry = {};
    _.forEach(Game.rooms, function(room) {
        Util.Spawner.loop(room, cnt, needExtraHarvester);
        Util.Tower.loop(room);
        entry[room.name] = room.energyAvailable;
    });
    Util.Stat.memorize('last-energyAvailable', entry);

    //Count cpu used stat
    const elapsed = Game.cpu.getUsed() - startCpu;
    Util.Stat.memorize('last-cpu-used-total', elapsed);
}

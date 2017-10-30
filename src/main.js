var _global = require('global');
var _extension = require('extension');

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

const CARRY_TO_ENERGY_POWER = 5; //hardcode

var mod = {};
module.exports = mod;
mod.loop = function () {
    Util.GC.loop();

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
    
    //FIXME cnt is not pair with every room
    _.forEach(Game.rooms, function(room) {
        Util.Spawner.loop(room, cnt, energyInPerTick, energyOutPerTick);
        Util.Tower.loop(room);
    });

    Util.Mark.loop();
}

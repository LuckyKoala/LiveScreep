var _global = require('global');

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var utilSpawner = require('util.spawner');

var mod = {};
module.exports = mod;
mod.loop = function () {
    var cnt = {
        'harvester': 0,
        'builder': 0,
        'upgrader': 0,
        'hauler': 0,
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        var role = creep.memory.role;
        var roleModule = Role[_.capitalize(role)];
        _.set(cnt, role, _.get(cnt, role, 0)+1); //_.update(cnt, role, function(n) { return n ? n + 1 : 0; });
        if(roleModule) {
            roleModule.loop(creep);
        } else {
            console.log('[Error] Undefined role module is in memory of creep -> '+name);
        }
    }
    
    //FIXME cnt is not pair with every room
    _.forEach(Game.rooms, function(room) {
        utilSpawner.loop(room, cnt);
    });
    //utilSpawner.loop(Game.spawns['S-E48S9-1'].room, cnt);
}

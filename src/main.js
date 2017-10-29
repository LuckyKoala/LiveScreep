var _global = require('global');

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var utilSpawner = require('util.spawner');

var mod = {};
module.exports = mod;
mod.loop = function () {
    var cntH = 0;
    var cntB = 0;
    var cntU = 0;
    var cntH = 0;

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            cntH++;
            Role.Harvester.loop(creep);
        }
        if(creep.memory.role == 'upgrader') {
            cntU++;
            Role.Upgrader.loop(creep);
        }
        if(creep.memory.role == 'builder') {
            cntB++;
            Role.Builder.loop(creep);
        }
        if(creep.memory.role == 'hauler') {
            cntH++;
            Role.Hauler.loop(creep);
        }
    }
    var cnt = {
        'harvester': cntH,
        'builder': cntB,
        'upgrader': cntU,
    }
    //FIXME cnt is not pair with every room
    _.forEach(Game.rooms, function(room) {
        utilSpawner.loop(room, cnt);
    });
    //utilSpawner.loop(Game.spawns['S-E48S9-1'].room, cnt);
}

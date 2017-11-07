var _global = require('global');
var _extension = require('extension');
const RoomManager = require('manager.room');
const profiler = require('screeps-profiler');

// This line monkey patches the global prototypes.
const EnableProfiler = Config.EnableProfiler || false;
if(EnableProfiler) profiler.enable();
module.exports.loop = function() {
  profiler.wrap(loop0);
}

const loop0 = function () {
    //Validate and clear data
    Util.GC.loop();
    Util.Mark.loop();
    Util.Stat.loop();
    //Run rooms
    var entry = {};
    _.forEach(Game.rooms, function(room) {
        RoomManager.loop(room);
        entry[room.name] = room.energyAvailable;
    });
    Util.Stat.memorize('last-energyAvailable', entry);
    //Run creeps
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        var role = creep.memory.role;
        var roleModule = Role[_.capitalize(role)];
        
        if(roleModule) {
            roleModule.loop(creep);
        } else {
            console.log('[Error] Undefined role module is in memory of creep -> '+name);
        }
    }
}

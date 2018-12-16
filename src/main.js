var _global = require('global');
var _extension = require('extension');
const RoomManager = require('manager_room');
const profiler = require('lib_screeps-profiler');

// This line monkey patches the global prototypes.
const EnableProfiler = Config.EnableProfiler;
if(EnableProfiler) profiler.enable();
module.exports.loop = function() {
  profiler.wrap(loop0);
};

const loop0 = function () {
    //Validate and clear data
    clearCreepAndStructure();
    Util.SourceMark.loop();
    Util.Stat.loop();
    //Run rooms
    var entry = {};
    _.forEach(Game.rooms, function(room) {
        //Compute threat value
        Util.Defense.loop(room);
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
            //TODO assign a role depends on its body part
            console.log('[Error] Undefined role module is in memory of creep -> '+name);
        }
    }
};

var clearCreepAndStructure = function() {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory: ', name);
        }
    }
    for(var id in Memory.structures) {
        if(!Game.getObjectById(id)) {
            delete Memory.structures[id];
            console.log('Clearing non-existing structure memory: ', id);
        }
    }
    //Consider do gc for Memory.rooms
};

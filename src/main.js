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
    //Run rooms
    var entry = {};
    _.forEach(Game.rooms, function(room) {
        //Compute threat value
        Util.Defense.loop(room);
        RoomManager.dispatch(room);
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
    //Validate and clear data
    GC();
    Util.SourceMark.loop();
    Util.Stat.loop();
};

function GC() {
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory: ', name);
        }
    }
    for(let id in Memory.structures) {
        if(!Game.getObjectById(id)) {
            delete Memory.structures[id];
            console.log('Clearing non-existing structure memory: ', id);
        }
    }
    for(let id in Memory.sources) {
        if(!Game.getObjectById(id)) {
            delete Memory.sources[id];
            console.log('Clearing non-existing source memory: ', id);
        }
    }
    for(let name in Memory.rooms) {
        if(Game.rooms[name] === undefined) {
            delete Memory.rooms[name];
            console.log('Clearing non-existing room memory: ', name);
        }
    }
    for(let name in Memory.construction) {
        if(Game.rooms[name] === undefined) {
            delete Memory.construction[name];
            console.log('Clearing non-existing construction memory: ', name);
        }
    }
};

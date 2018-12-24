var _global = require('global');
var _extension = require('extension');
const RoomManager = require('manager_room');
const profiler = require('lib_screeps-profiler');
const _roomvisual = require('lib_RoomVisual');

// This line monkey patches the global prototypes.
const EnableProfiler = Config.EnableProfiler;
if(EnableProfiler) profiler.enable();
module.exports.loop = function() {
    profiler.wrap(loop0);
};

const version = 4;
const loop0 = function () {
    //Version update
    const previoudVersion = Memory.version || 0;
    if(previoudVersion!==version) {
        //Do something for breaking change between versions
        console.log(`Upgraded to version ${version}`);
        Memory.version = version;
    }
    //Run rooms
    _.forEach(Game.rooms, room => RoomManager.dispatch(room));
    //Run creeps
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        var role = creep.memory.role;
        var roleModule = Role[role];
        
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
            RoomManager.expireRoom(name);
        }
    }
    for(let name in Memory.construction) {
        if(Game.rooms[name] === undefined) {
            delete Memory.construction[name];
            console.log('Clearing non-existing construction memory: ', name);
        }
    }
};

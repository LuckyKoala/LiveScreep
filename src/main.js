//Library
const profiler = require('lib_screeps-profiler');
const _roomvisual = require('lib_RoomVisual');
//Global and prototypes
const _global = require('global');
const _extension = require('extension');
//Managers
const RoomManager = require('manager_room');
const TaskManager = require('manager_task');
const CreepManager = require('manager_creep');

// This line monkey patches the global prototypes.
const EnableProfiler = Config.EnableProfiler;
if(EnableProfiler) profiler.enable();
module.exports.loop = function() {
    profiler.wrap(loop0);
};

const version = 1;
const loop0 = function () {
    const baseFlags = _.filter(Game.flags, flag => FlagUtil.base.examine(flag));
    if(baseFlags.length === 0) {
        Logger.warning(`Can't find base flag (${FlagUtil.base.describe()}), main loop paused.`);
        return;
    }

    Logger.trace('=======Main Loop Start====>>>');
    Util.SourceMark.loop();
    //Version update
    const previoudVersion = Memory.version || 0;
    if(previoudVersion!==version) {
        //Do something for breaking change between versions
        Logger.info(`Upgraded to version ${version}`);
        Memory.version = version;
    }
    //Run tasks to get creep spawn queue
    Logger.trace('1. Running task manager');
    try { TaskManager.loop(); } catch (e) { Logger.fatal("error with task manager loop\n" + e.stack); }
    //Run rooms to get metadata and run structures
    Logger.trace('2. Running room manager');
    try { RoomManager.loop(); } catch (e) { Logger.fatal("error with room manager loop\n" + e.stack); }
    //Run creeps
    Logger.trace('3. Running creep manager');
    try { CreepManager.loop(); } catch (e) { Logger.fatal("error with creep manager loop\n" + e.stack); }
    //Validate and clear data
    Logger.trace('4. Running garbage collection');
    GC();
    Logger.trace('<<<====Main Loop End=======');
};

function GC() {
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            Logger.trace('Clearing non-existing creep memory: ', name);
        }
    }
    for(let id in Memory.structures) {
        if(!Game.getObjectById(id)) {
            delete Memory.structures[id];
            Logger.info('Clearing non-existing structure memory: ', id);
        }
    }
    for(let id in Memory.sources) {
        if(!Game.getObjectById(id)) {
            delete Memory.sources[id];
            Logger.info('Clearing non-existing source memory: ', id);
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
            Logger.info('Clearing non-existing construction memory: ', name);
        }
    }
};

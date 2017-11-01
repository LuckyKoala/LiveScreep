var _global = require('global');
var _extension = require('extension');

var mod = {};
module.exports = mod;
mod.loop = function () {
    Util.Stat.memorize('last-cpu-used-for-parse', Game.cpu.getUsed());
    //Validate and clear data
    Util.GC.loop();
    Util.Mark.loop();
    Util.Stat.loop();
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
    //Run rooms
    var entry = {};
    _.forEach(Game.rooms, function(room) {
        Util.Spawner.loop(room);
        Util.Tower.loop(room);
        entry[room.name] = room.energyAvailable;
    });
    Util.Stat.memorize('last-energyAvailable', entry);
    Util.Stat.memorize('last-cpu-used-total', Game.cpu.getUsed());
}

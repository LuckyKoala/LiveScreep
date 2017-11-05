var _global = require('global');
var _extension = require('extension');

var mod = {};
module.exports = mod;
mod.loop = function () {
    Memory.start; //Init memory
    const cpuUsedForParse = Game.cpu.getUsed();
    //Validate and clear data
    Util.GC.loop();
    Util.Mark.loop();
    Util.Stat.loop();
    Util.Stat.memorize('last-cpu-used-for-parse-and-clear', cpuUsedForParse);
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
        room.saveLinks();
        Util.Construction.loop(room);
        Util.Spawner.loop(room);
        Util.Tower.loop(room);
        Util.Link.loop(room);
        entry[room.name] = room.energyAvailable;
    });
    Util.Stat.memorize('last-energyAvailable', entry);
    
    const previousCpuUsedTotal = Util.Stat.find('previousCpuUsedTotal', 0);
    const previousCpuUsedCountTimes = Util.Stat.find('previousCpuUsedCountTimes', 0);
    const currentCpuUsed = Game.cpu.getUsed();
    if(previousCpuUsedCountTimes >= 36000) {
        //~1 day, clear it
        Util.Stat.memorizePermanant('previousCpuUsedTotal', currentCpuUsed);
        Util.Stat.memorizePermanant('previousCpuUsedCountTimes', 1);
        Util.Stat.memorizePermanant('previousCpuUsedAverage', currentCpuUsed);
    } else {
        Util.Stat.memorizePermanant('previousCpuUsedTotal', previousCpuUsedTotal+currentCpuUsed);
        Util.Stat.memorizePermanant('previousCpuUsedCountTimes', previousCpuUsedCountTimes+1);
        Util.Stat.memorizePermanant('previousCpuUsedAverage', (previousCpuUsedTotal+currentCpuUsed)/(previousCpuUsedCountTimes+1));
    }
}

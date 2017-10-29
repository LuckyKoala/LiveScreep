/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('util.spawner');
 * mod.thing == 'a thing'; // true
 
 Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], 'Worker1', {
    memory: {role: 'harvester'}
});
 */
var mod = {};
module.exports = mod;

mod.loop = function(room, cnt) {
    var spawn = Game.spawns['S-E48S9-1'];
    //Check energy available first
    if(room.energyAvailable < 200) {
        //console.log('Not enough energy to spawn next creep');
        return;
    }
    
    //Population control
    if(cnt.harvester < 2) {
        this.spawnHarvester(spawn);
    } else if(cnt.upgrader < 3) {
        this.spawnUpgrader(spawn);
    } else {
        var targets = room.find(FIND_CONSTRUCTION_SITES);
        if(targets.length && cnt.builder < 2) {
            this.spawnBuilder(spawn);
        } else if(cnt.upgrader < 5) {
            this.spawnUpgrader(spawn);
        }
    }
};

mod.spawnHarvester = function(spawn) {
    var a = ['[H]John','[H]Amy','[H]Bob']
    var result = OK;
    var name;
    
    for(var i=0;i<a.length;i++) {
        name = a[i];
        result = spawn.spawnCreep([WORK, CARRY, MOVE], name, { dryRun: true });
        if(result==OK) break; 
    }
    
    spawn.spawnCreep([WORK, CARRY, MOVE], name, {
        memory: {role: 'harvester'}
    });
    console.log('Spawning '+name);
};

mod.spawnUpgrader = function(spawn) {
    var a = ['[U]Dog','[U]Cat','[U]Meow','[U]Mummy','[U]Ass','[U]God']
    var result = OK;
    var name;
    
    for(var i=0;i<a.length;i++) {
        name = a[i];
        result = spawn.spawnCreep([WORK, CARRY, MOVE], name, { dryRun: true });
        if(result==OK) break; 
    }
    
    spawn.spawnCreep([WORK, CARRY, MOVE], name, {
        memory: {role: 'upgrader'}
    });
    console.log('Spawning '+name);
};

mod.spawnBuilder = function(spawn) {
    var a = ['[B]Amd','[B]Lucky','[B]Gentleman']
    var result = OK;
    var name;
    
    for(var i=0;i<a.length;i++) {
        name = a[i];
        result = spawn.spawnCreep([WORK, CARRY, MOVE], name, { dryRun: true });
        if(result==OK) break; 
    }
    
    spawn.spawnCreep([WORK, CARRY, MOVE], name, {
        memory: {role: 'builder'}
    });
    console.log('Spawning '+name);
};





var mod = {};
module.exports = mod;

mod.loop = function(room, cnt) {
    var spawns = _.filter(Game.spawns, function(spawn) { return spawn.room == room; });
    var spawn = spawns[0];
    //Check energy available first
    if(room.energyAvailable < 200) {
        //console.log('Not enough energy to spawn next creep');
        return;
    }
    
    //Population control
    if(cnt.harvester < 2) {
        this.spawnHarvester(spawn);
    } else if(cnt.hauler < 1) {
        this.spawnHauler(spawn);
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

mod.spawnHauler = function(spawn) {
    var a = ['[Ha]Gold','[Ha]Iron']
    var result = OK;
    var name;
    
    for(var i=0;i<a.length;i++) {
        name = a[i];
        result = spawn.spawnCreep([CARRY, MOVE], name, { dryRun: true });
        if(result==OK) break; 
    }
    
    spawn.spawnCreep([CARRY, MOVE], name, {
        memory: {role: 'hauler'}
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





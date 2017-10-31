//var utilWar = require('util.war');

var mod = {};
module.exports = mod;

mod.loop = function(room, cnt, needExtraHarvester) {
    var spawns = _.filter(Game.spawns, function(spawn) { return spawn.room == room; });
    this.spawn = spawns[0];
    this.energyAvailable = room.energyAvailable;
    this.room = room;
    
    if(cnt.harvester < 2) {
        this.spawnHarvester();
        return;
    }

    //Spawn 1 hauler at least
    if(cnt.hauler < 1) {
        this.spawnHauler();
        return;
    } 
    //Try spawn guardian
    //TODO honour threat value
    const hostiles = room.find(FIND_HOSTILE_CREEPS);
    if(hostiles.length && cnt.guardian < 1) {
        this.spawnGuardian();
        return;
    }
    
    if(cnt.upgrader < 1) {
        this.spawnUpgrader();
        return;
    } 

    //Spawn extra harvester
    //It can decrease the possiblity of source being not taken 
    //  and the possiblity of source container decay to nothing
    //  which may also lead to lacking of energy of tower.
    if(cnt.harvester < 3 && needExtraHarvester) {
        this.spawnHarvester();
        return;
    }
    
    var targets = room.find(FIND_CONSTRUCTION_SITES);
    if(targets.length && cnt.builder < 1) {
        this.spawnBuilder();
    } else if(cnt.upgrader < 2) {
        this.spawnUpgrader();
    }
};

mod.spawnHarvester = function(minimum = false) {
    var essBody = [WORK, CARRY, MOVE];
    var extraBody = [WORK, WORK, MOVE];
    var names = ['[H]John','[H]Amy','[H]Bob']
    this.spawn0(essBody, extraBody, minimum, names, {role: 'harvester'});
};

mod.spawnHauler = function(minimum = false) {
    var essBody = [CARRY, MOVE];
    var extraBody = [CARRY, CARRY, MOVE];
    var names = ['[Ha]Gold','[Ha]Iron'];
    this.spawn0(essBody, extraBody, minimum, names, {role: 'hauler'});
};

mod.spawnUpgrader = function(minimum = false) {
    var essBody = [WORK, CARRY, MOVE];
    var extraBody = [WORK, WORK, CARRY, MOVE, MOVE];
    var names = ['[U]Dog','[U]Cat','[U]Meow','[U]Mummy','[U]Ass','[U]God']
    this.spawn0(essBody, extraBody, minimum, names, {role: 'upgrader'});
};

mod.spawnBuilder = function(minimum = false) {
    var essBody = [WORK, CARRY, MOVE];
    var extraBody = [WORK, CARRY, MOVE];
    var names = ['[B]Amd','[B]Lucky','[B]Gentleman'];
    this.spawn0(essBody, extraBody, minimum, names, {role: 'builder'});
};

mod.spawnGuardian = function(minimum = false) {
    if(!Util.War.shouldSpawnGuardian(this.room)) return;
    var essBody = [ATTACK, MOVE];
    var extraBody = [ATTACK, TOUGH, MOVE];
    var names = ['[G]Maze','[B]Bug'];
    this.spawn0(essBody, extraBody, minimum, names, {role: 'guardian'});
};

mod.spawn0 = function(essBody, extraBody, minimum, names, memory) {
    var spawn = this.spawn;
    //Calculate body and examine whether energyAvailable is enough
    var body = minimum ? essBody : this.getMaxiumBody(essBody, extraBody);
    var bodyCost = this.getBodyCost(body);
    if(this.energyAvailable < bodyCost) return;
    //Calculate name
    var name;
    var result;
    for(var i=0;i<names.length;i++) {
        name = names[i];
        result = spawn.spawnCreep(body, name, { dryRun: true });
        if(result==OK) {
            spawn.spawnCreep(body, name, {
                memory: memory,
            });
            console.log('Spawning '+name);
            break;
        } 
    }
}

mod.getMaxiumBody = function(essBody, extraBody) {
    var essCost = this.getBodyCost(essBody);
    var extraCost = this.getBodyCost(extraBody); 
    var extraAmount = _.floor((this.energyAvailable - essCost) / extraCost);
    var body = essBody;
    for(var i=0; i<extraAmount; i++) {
        body.push(extraBody);
    }
    return _.flattenDeep(body);
}

mod.getBodyCost = function(bodyParts) {
    var cost = 0;
    for(var i=0; i<bodyParts.length; i++) {
        cost += BODYPART_COST[bodyParts[i]];
    }
    return cost;
}
//var utilWar = require('util.war');

var mod = {};
module.exports = mod;

mod.loop = function(room, cnt, needExtraHarvester) {
    var spawns = _.filter(Game.spawns, function(spawn) { return spawn.room == room; });
    this.spawn = spawns[0];
    if(!!this.spawn.spawning) return; //Return if spawn is busy.
    this.energyAvailable = room.energyAvailable;
    this.room = room;

    //=====Check state=====
    
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
    const essBody = [WORK, CARRY, MOVE];
    const extraBody = [WORK, WORK, MOVE];
    const prefix = '[Harvester]';
    const memory = {role: 'harvester'};
    this.spawn0(essBody, extraBody, minimum, prefix, memory);
};

mod.spawnHauler = function(minimum = false) {
    const essBody = [WORK, CARRY, MOVE]; //One work to maintain container
    const extraBody = [CARRY, CARRY, MOVE];
    const prefix = '[Hauler]';
    const memory = {role: 'hauler'};
    this.spawn0(essBody, extraBody, minimum, prefix, memory);
};

mod.spawnUpgrader = function(minimum = false) {
    const essBody = [WORK, CARRY, MOVE];
    const extraBody = [WORK, WORK, MOVE];
    const prefix = '[Upgrader]';
    const memory = {role: 'upgrader'};
    this.spawn0(essBody, extraBody, minimum, prefix, memory);
};

mod.spawnBuilder = function(minimum = false) {
    const essBody = [WORK, CARRY, MOVE];
    const extraBody = [WORK, CARRY, MOVE];
    const prefix = '[Builder]';
    const memory = {role: 'builder'};
    this.spawn0(essBody, extraBody, minimum, prefix, memory);
};

mod.spawnGuardian = function(minimum = false) {
    if(!Util.War.shouldSpawnGuardian(this.room)) return;
    const essBody = [ATTACK, MOVE];
    const extraBody = [ATTACK, TOUGH, MOVE];
    const prefix = '[Guardian]';
    const memory = {role: 'guardian'};
    this.spawn0(essBody, extraBody, minimum, prefix, memory);
};

mod.spawn0 = function(essBody, extraBody, minimum, prefix, memory) {
    //Calculate body and examine whether energyAvailable is enough
    const body = minimum ? essBody : this.getMaxiumBody(essBody, extraBody);
    const bodyCost = this.getBodyCost(body);
    //Check energyAvailable is enough for this spawn action
    if(this.energyAvailable < bodyCost) return;
    //Calculate name
    const name = prefix+Game.time;
    const result = this.spawn.spawnCreep(body, name, {
        memory: memory,
    });
    console.log('Code['+result+']Spawning '+name+" whose cost is "+bodyCost);
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
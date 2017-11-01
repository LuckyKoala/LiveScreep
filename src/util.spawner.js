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

mod.spawnWorker = function(minimum = false) {
    this.spawnWithSetup(Role.Worker.Setup, minimum);
};

mod.spawnHarvester = function(minimum = false) {
    this.spawnWithSetup(Role.Harvester.Setup, minimum);
}

mod.spawnHauler = function(minimum = false) {
    this.spawnWithSetup(Role.Hauler.Setup, minimum);
};

mod.spawnUpgrader = function(minimum = false) {
    this.spawnWithSetup(Role.Upgrader.Setup, minimum);
};

mod.spawnBuilder = function(minimum = false) {
    this.spawnWithSetup(Role.Builder.Setup, minimum);
};

mod.spawnGuardian = function(minimum = false) {
    if(!Util.War.shouldSpawnGuardian(this.room)) return;
    this.spawnWithSetup(Role.Guardian.Setup, minimum);
};

/*
let myFunc = function({x,y,z}) {
    console.log(x,y,z);
};

myFunc({x:10,y:20,z:30});
 */
mod.spawnWithSetup = function({essBody, extraBody, prefix, memory}, minimum) {
    this.spawn0(essBody, extraBody, prefix, memory, minimum);
}

mod.spawn0 = function(essBody, extraBody, prefix, memory, minimum) {
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
    if(extraCost===0) return essBody;

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
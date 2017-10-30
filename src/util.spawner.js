//var utilWar = require('util.war');

var mod = {};
module.exports = mod;

const factor = 1.2;
const sourceGeneratePerTick = 2 * (SOURCE_ENERGY_CAPACITY / ENERGY_REGEN_TIME); //Currently 10

//TODO limit max part number
//TODO not only limit by num, should also consider body part
mod.loop = function(room, cnt, energyInPerTick, energyOutPerTick) {
    var spawns = _.filter(Game.spawns, function(spawn) { return spawn.room == room; });
    this.spawn = spawns[0];
    this.energyAvailable = room.energyAvailable;
    
    //Precise population control
    if(cnt.havester < 2) {
        this.spawnHarvester();
        return;
    }

    //const energyOutMaxPerTick = energyInPerTick - energyOutPerTick;
    //Spawn 1 hauler at least
    if(cnt.hauler < 2) {
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

    //Now we can consider more type of creep
    if(energyInPerTick <= energyOutPerTick) {
        //It seems we should spawn more harvester
        //Check whether source can take more harvester
        if(energyInPerTick < sourceGeneratePerTick*factor) {
            //Oh!Let's do it
            this.spawnHarvester();
        } 
    } else {
        if(cnt.upgrader < 1) {
            this.spawnUpgrader();
            return;
        } 
        
        //Now we have 2 harvester, 2 hauler and 1 upgrader at least
        //Check if there is any construction site
        var targets = room.find(FIND_CONSTRUCTION_SITES);
        if(targets.length && cnt.builder < 1) {
            this.spawnBuilder();
        } else if(cnt.upgrader < 5) {
            this.spawnUpgrader();
        }
    }
};

mod.spawnHarvester = function(minimum = false) {
    var essBody = [WORK, MOVE];
    var extraBody = [WORK, WORK, MOVE];
    var names = ['[H]John','[H]Amy','[H]Bob']
    this.spawn0(essBody, extraBody, minimum, names, {role: 'harvester'});
};

mod.spawnHauler = function(minimum) {
    var essBody = [CARRY, MOVE];
    var extraBody = [CARRY, CARRY, MOVE];
    var names = ['[Ha]Gold','[Ha]Iron'];
    this.spawn0(essBody, extraBody, minimum, names, {role: 'hauler'});
};

mod.spawnUpgrader = function(minimum) {
    var essBody = [WORK, CARRY, MOVE];
    var extraBody = [WORK, WORK, CARRY, MOVE, MOVE];
    var names = ['[U]Dog','[U]Cat','[U]Meow','[U]Mummy','[U]Ass','[U]God']
    this.spawn0(essBody, extraBody, minimum, names, {role: 'upgrader'});
};

mod.spawnBuilder = function(minimum) {
    var essBody = [WORK, CARRY, MOVE];
    var extraBody = [WORK, CARRY, MOVE];
    var names = ['[B]Amd','[B]Lucky','[B]Gentleman'];
    this.spawn0(essBody, extraBody, minimum, names, {role: 'builder'});
};

mod.spawnGuardian = function(minimum) {
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









var mod = {};
module.exports = mod;

mod.loop = function(room, cnt) {
    var spawns = _.filter(Game.spawns, function(spawn) { return spawn.room == room; });
    this.spawn = spawns[0];

    this.energyAvailable = room.energyAvailable;
    
    //Population control
    //At least, we need one harvester and one hauler
    // if there is no more creep, so we can make spawn back to life
    if(cnt.harvester < 1) {
        this.spawnHarvester(true);
    } else if(cnt.hauler < 1) {
        this.spawnHauler(true);
    } else if(cnt.harvester < 2) {
        this.spawnHarvester();
    } else if(cnt.hauler < 2) {
        this.spawnHauler();
    } else if(cnt.upgrader < 3) {
        this.spawnUpgrader();
    } else {
        var targets = room.find(FIND_CONSTRUCTION_SITES);
        if(targets.length && cnt.builder < 2) {
            this.spawnBuilder();
        } else if(cnt.upgrader < 5) {
            this.spawnUpgrader();
        }
    }
};
//TODO memorize source and mark it, calcaulate available spot
mod.spawnHarvester = function(minimum = false) {
    var essBody = [WORK, CARRY, MOVE];
    var extraBody = [WORK];
    var names = ['[H]John','[H]Amy','[H]Bob']
    this.spawn0(essBody, extraBody, minimum, names, {role: 'harvester'});
};

mod.spawnHauler = function(minimum) {
    var essBody = [CARRY, MOVE];
    var extraBody = [CARRY, MOVE];
    var names = ['[Ha]Gold','[Ha]Iron'];
    this.spawn0(essBody, extraBody, minimum, names, {role: 'hauler'});
};

mod.spawnUpgrader = function(minimum) {
    var essBody = [WORK, CARRY, MOVE];
    var extraBody = [WORK, WORK, CARRY];
    var names = ['[U]Dog','[U]Cat','[U]Meow','[U]Mummy','[U]Ass','[U]God']
    this.spawn0(essBody, extraBody, minimum, names, {role: 'upgrader'});
};

mod.spawnBuilder = function(minimum) {
    var essBody = [WORK, CARRY, MOVE];
    var extraBody = [WORK, CARRY];
    var names = ['[B]Amd','[B]Lucky','[B]Gentleman'];
    this.spawn0(essBody, extraBody, minimum, names, {role: 'builder'});
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









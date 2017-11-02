var mod = {};
module.exports = mod;

const CARRY_TO_ENERGY_POWER = 1; //hardcode
const MAXIUM_ENERGY_GENERATE_PER_TICK = 2*SOURCE_ENERGY_CAPACITY/ENERGY_REGEN_TIME; //Currently 20
const WORKER_FACTOR = 1.2; //Cause worker will not stay still, the movement will cosume time.

mod.loop = function(room) {
    this.room = room;
    const roomName = this.room.name;
    const roomCreeps = _.filter(Game.creeps, function(creep) { return creep.memory.homeRoom == roomName; });
    this.spawns = _.filter(Game.spawns, function(spawn) { return spawn.room.name == roomName; });
    this.spawn = this.spawns[0]; //TODO each spawn can spawn creep individually
    this.energyAvailable = this.room.energyAvailable;
    this.rcl = this.room.controller.level;

    if(!!this.spawn.spawning) return; //Return if spawn is busy.

    //TODO extract logic to setup.%role% module
    //=====Diff spawn strategy by current RCL=====
    if(this.rcl < 3) {
        //Worker is enough for harvest and upgrade
        var energyInPerTick = 0;
        for(var name in roomCreeps) {
            const creep = roomCreeps[name];
            const role = creep.memory.role;
            if(role === 'worker') {
                energyInPerTick += creep.getActiveBodyparts(WORK) * HARVEST_POWER;
            } else {
                console.log('[Error] Find non-worker in low RCL room, name is '+name);
            }
        }
        if(energyInPerTick < MAXIUM_ENERGY_GENERATE_PER_TICK * WORKER_FACTOR) {
            this.spawnWithSetup(Role.Worker.Setup);
        }
    } else {
        //All role is required
        var cnt = {
            total: 0,
            harvester: 0,
            hauler: 0,
            upgrader: 0,
            builder: 0,
            guardian: 0,
        }
        var energyInPerTick = 0;
        var energyOutPerTick = 0;
        for(var name in roomCreeps) {
            const creep = roomCreeps[name];
            const role = creep.memory.role;
            //Calculate energyIn/Out per tick
            if(role == "harvester") {
                cnt.harvester++;
                energyInPerTick += creep.getActiveBodyparts(WORK) * HARVEST_POWER;
            } else if(role == "hauler") {
                cnt.hauler++;
                energyOutPerTick += creep.getActiveBodyparts(CARRY) * CARRY_TO_ENERGY_POWER;
            } else if(role == "upgrader") {
                cnt.upgrader++;
                energyOutPerTick += creep.getActiveBodyparts(WORK) * UPGRADE_CONTROLLER_POWER;
            } else if(role == "builder") {
                cnt.builder++;
                energyOutPerTick += creep.getActiveBodyparts(WORK) * BUILD_POWER;
            } else if(role == "guardian") {
                cnt.guardian++;
            }
        }
        //Log
        Util.Stat.memorize('last-energyInPerTick', energyInPerTick);
        Util.Stat.memorize('last-energyOutPerTick', energyOutPerTick);
        //TODO Analysis data to decide max amount of each type of creeps instead of use hardcode 
        //  which is bad practise.
        //TODO since we have limited max amount of each type of creeps, then we should also make
        //  sure all existing creep is biggest or else we try spawn bigger creep to replace it.
        //First we need one Harvester and one Hauler at least, which make sure spawn have incoming energy
        if(cnt.harvester < 1) {
            this.spawnWithSetup(Role.Harvester.Setup);
            return;
        } 
        if(cnt.hauler < 1) {
            this.spawnWithSetup(Role.Hauler.Setup);
            return;
        }
        //Then spawn guardian if required
        //TODO honour threat value
        const hostiles = room.find(FIND_HOSTILE_CREEPS);
        if(hostiles.length && Util.War.shouldSpawnGuardian(this.room) && cnt.guardian < 1) {
            this.spawnWithSetup(Role.Guardian.Setup);
            return;
        }
        //Now we need enough harvester, currently 2 is enough for normal room
        if(cnt.harvester < 2) {
            this.spawnWithSetup(Role.Harvester.Setup);
            return;
        }
        //Then spawn upgrader
        if(cnt.upgrader < 1) {
            this.spawnWithSetup(Role.Upgrader.Setup);
            return;
        }
        //Then spawn builder if required
        const targets = room.find(FIND_CONSTRUCTION_SITES);
        if(targets.length && cnt.builder < 1) {
            this.spawnWithSetup(Role.Builder.Setup);
            return;
        }
    }
};

/*
let myFunc = function({x,y,z}) {
    console.log(x,y,z);
};

myFunc({x:10,y:20,z:30});
 */
mod.spawnWithSetup = function(setupObj) {
    var setup = setupObj.Normal;
    //For low energy available
    if(this.energyAvailable < setupObj.Normal.minEnergy && !!setupObj.Low) {
        setup = setupObj.Low;
    }
    var {minEnergy, essBody, extraBody, prefix, memory, maxExtraAmount} = setup;
    //Calculate body and examine whether energyAvailable is enough
    const body = this.getMaxiumBody(essBody, extraBody, maxExtraAmount);
    const bodyCost = this.getBodyCost(body);
    //Check energyAvailable is enough for this spawn action
    if(this.energyAvailable < bodyCost) return;
    //Calculate name
    const name = prefix+Game.time;
    memory['homeRoom'] = this.room.name;
    const result = this.spawn.spawnCreep(body, name, {
        memory: memory,
    });
    console.log('ResultCode['+result+'] for Spawning '+name+" whose cost is "+bodyCost);
}

mod.getMaxiumBody = function(essBody, extraBody, maxExtraAmount) {
    var essCost = this.getBodyCost(essBody);
    var extraCost = this.getBodyCost(extraBody);
    if(extraCost===0) return essBody;

    var extraAmount = _.floor((this.energyAvailable - essCost) / extraCost);
    if(!!maxExtraAmount && extraAmount>maxExtraAmount) extraAmount = maxExtraAmount;
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
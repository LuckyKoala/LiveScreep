var mod = {};
module.exports = mod;

const CARRY_TO_ENERGY_POWER = 1; //hardcode
const MAXIUM_ENERGY_GENERATE_PER_TICK = 2*SOURCE_ENERGY_CAPACITY/ENERGY_REGEN_TIME; //Currently 20
const WORKER_FACTOR = 1.2; //Cause worker will not stay still, the movement will cosume time.

mod.getSpawnsInRoom = function(roomName) {
    return _.filter(Game.spawns, function(spawn) { return spawn.room.name == roomName; });
}

mod.loop = function(room) {
    this.room = room;
    const roomName = this.room.name;
    const roomCreeps = _.filter(Game.creeps, function(creep) { return creep.memory.homeRoom == roomName; });
    this.spawns = this.getSpawnsInRoom(roomName);
    this.energyAvailable = this.room.energyAvailable;
    this.rcl = this.room.controller.level;

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
        //Try all the spawn
        var remain = this.spawns.length;
        while(remain-- && energyInPerTick < MAXIUM_ENERGY_GENERATE_PER_TICK * WORKER_FACTOR) {
            const newCreep = this.spawnWithSetup(Role.Worker.Setup);
            if(newCreep) energyInPerTick += newCreep.getActiveBodyparts(WORK) * HARVEST_POWER;
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
            filler: 0,
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
            } else if(role == "filler") {
                cnt.filler++;
            }
        }
        //Log
        Util.Stat.memorize('last-energyInPerTick', energyInPerTick);
        Util.Stat.memorize('last-energyOutPerTick', energyOutPerTick);
        //Try all the spawn
        var remain = this.spawns.length;
        while(remain--) {
            //TODO Analysis data to decide max amount of each type of creeps instead of use hardcode
            //  which is bad practise.
            //TODO since we have limited max amount of each type of creeps, then we should also make
            //  sure all existing creep is biggest or else we try spawn bigger creep to replace it.
            //First we need one Harvester and one Hauler at least, which make sure spawn have incoming energy
            if(cnt.harvester < 1) {
                if(this.spawnWithSetup(Role.Harvester.Setup)) cnt.harvester++;
                continue;
            } 
            if(cnt.hauler < 1) {
                if(this.spawnWithSetup(Role.Hauler.Setup)) cnt.hauler++;
                continue;
            }
            //Then spawn filler if required
            if(room.storage && cnt.filler < 1) {
                if(this.spawnWithSetup(Role.Filler.Setup)) cnt.filler++;
                continue;
            }
            //Then spawn guardian if required
            //TODO honour threat value
            const hostiles = room.find(FIND_HOSTILE_CREEPS);
            if(hostiles.length && Util.War.shouldSpawnGuardian(this.room) && cnt.guardian < 1) {
                if(this.spawnWithSetup(Role.Guardian.Setup)) cnt.guardian++;
                continue;
            }
            //Now we need enough harvester, currently 2 is enough for normal room
            if(cnt.harvester < 2) {
                if(this.spawnWithSetup(Role.Harvester.Setup)) cnt.harvester++;
                continue;
            }
            //Then spawn upgrader
            if(cnt.upgrader < 1) {
                if(this.spawnWithSetup(Role.Upgrader.Setup, this.rcl == 8)) cnt.upgrader++;
                continue;
            }
            //Then spawn builder if required
            const needBuildStructures = room.find(FIND_CONSTRUCTION_SITES);
            const needRepairStructures = room.find(FIND_STRUCTURES, {
                filter: function(o) {
                    return o.hits < o.hitsMax;
                }
            });
            const needBuilder = (needBuildStructures.length + needRepairStructures.length) > 0;
            if(needBuilder && cnt.builder < 1) {
                if(this.spawnWithSetup(Role.Builder.Setup)) cnt.builder++;
                continue;
            }
        }

    }
};

mod.spawnWithSetup = function(setupObj, useHighLevel=false) {
    //Get spawn
    const spawn = this.spawns.shift();
    if(spawn.spawning) return;

    var setup = useHighLevel ? setupObj.High : setupObj.Normal;
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
    const result = spawn.spawnCreep(body, name, {
        memory: memory,
    });
    console.log(`Code[${result}] Spawning ${name}, cost ${bodyCost}, body ${JSON.stringify(body)}`);
    if(result == OK) return Game.creeps[name];
    else return false;
}

const bodyMaxium = 50; //Creep Body Part Maxium Amount
mod.getMaxiumBody = function(essBody, extraBody, maxExtraAmount) {
    var essCost = this.getBodyCost(essBody);
    var extraCost = this.getBodyCost(extraBody);
    if(extraCost===0) return essBody;

    var extraAmount = _.floor((this.energyAvailable - essCost) / extraCost);
    if(!!maxExtraAmount && extraAmount>maxExtraAmount) extraAmount = maxExtraAmount;
    const remainAmount = _.floor((bodyMaxium-essBody.length) / extraBody.length);
    if(extraAmount > remainAmount) extraAmount = remainAmount;

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
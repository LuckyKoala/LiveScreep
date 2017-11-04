var mod = {};
module.exports = mod;

const CARRY_TO_ENERGY_POWER = 1; //hardcode
const MAXIUM_ENERGY_GENERATE_PER_TICK = 2*SOURCE_ENERGY_CAPACITY/ENERGY_REGEN_TIME; //Currently 20
const WORKER_FACTOR = 1.2; //Cause worker will not stay still, the movement will cosume time.

const SpawnQueueHigh = [Setup.Guardian];
const SpawnQueueNormal = [Setup.Harvester, Setup.Hauler, Setup.Filler];
const SpawnQueueLow = [Setup.Upgrader, Setup.Builder];
const SpawnQueue = _.union(SpawnQueueHigh, SpawnQueueNormal, SpawnQueueLow);

const SpawnQueueForLowRCL = [Setup.Worker];

mod.getSpawnsInRoom = function(roomName) {
    return _.filter(Game.spawns, function(spawn) { return spawn.room.name == roomName; });
}

mod.loop = function(room) {
    const self = this;
    this.room = room;
    const roomName = this.room.name;
    const roomCreeps = _.filter(Game.creeps, function(creep) { return creep.memory.homeRoom == roomName; });
    this.spawns = this.getSpawnsInRoom(roomName);
    this.rcl = this.room.controller.level;

    const trySpawn = function(setupObj, successCallBack) {
        if(!spawningStatus && setupObj.shouldSpawn(room, cnt)) {
            spawningStatus = self.spawnWithSetup(spawn, setupObj);
            if(spawningStatus) {
                successCallBack({spawningStatus, setupObj}); //Pass data to callback function
            }
        }
    };

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
        var spawn = this.spawns.shift();
        while(spawn) {
            if(energyInPerTick >= MAXIUM_ENERGY_GENERATE_PER_TICK * WORKER_FACTOR) break;
            var spawningStatus = false;
            const callback = function({spawningStatus}) {
                energyInPerTick += spawningStatus.getActiveBodyparts(WORK) * HARVEST_POWER;
            };
            for(var index in SpawnQueueForLowRCL) {
                trySpawn(SpawnQueueForLowRCL[index], callback);
            }
            spawn = this.spawns.shift();
        }

    } else {
        var cnt = {
            total: 0,
        }
        _.forEach(Role, o => cnt[lowerFirst(o.roleName)] = 0); //Init cnt
        //All role is required
        for(var name in roomCreeps) {
            const creep = roomCreeps[name];
            const role = creep.memory.role;
            cnt[role]++;
        }
        //Try all the spawn
        var spawn = this.spawns.shift();
        while(spawn) {
            var spawningStatus = false;
            const callback = function({setupObj}) {
                const roleName = lowerFirst(setupObj.setupName);
                cnt[roleName]++;
            };
            for(var index in SpawnQueue) {
                trySpawn(SpawnQueue[index], callback);
            }
            spawn = this.spawns.shift();
        }
    }

    Util.Stat.memorize('last-creeps-cnt', cnt);
};

mod.spawnWithSetup = function(spawn, {setupConfig, shouldUseHighLevel}) {
    if(spawn.spawning) return;

    const energyAvailable = spawn.room.energyAvailable;
    var setup = shouldUseHighLevel() ? setupConfig.High : setupConfig.Normal;
    //For low energy available
    if(energyAvailable < setupConfig.Normal.minEnergy && !!setupConfig.Low) {
        setup = setupConfig.Low;
    }
    var {minEnergy, essBody, extraBody, prefix, memory, maxExtraAmount} = setup;
    //Calculate body and examine whether energyAvailable is enough
    const body = this.getMaxiumBody(essBody, extraBody, maxExtraAmount);
    const bodyCost = this.getBodyCost(body);
    //Check energyAvailable is enough for this spawn action
    if(energyAvailable < bodyCost) return;
    //Calculate name
    const name = prefix+spawn.name+'->'+Game.time;
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
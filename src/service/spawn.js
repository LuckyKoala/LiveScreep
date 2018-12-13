var mod = {};
module.exports = mod;

const SpawnQueueHigh = [Setup.Guardian];
const SpawnQueueNormal = [Setup.Harvester, Setup.Hauler, Setup.Filler];
const SpawnQueueLow = [Setup.Upgrader, Setup.Builder, Setup.Task];
const SpawnQueue = _.union(SpawnQueueHigh, SpawnQueueNormal, SpawnQueueLow);

mod.loop = function(room) {
    const self = this;
    const roomName = room.name;
    const roomCreeps = _.filter(Game.creeps, function(creep) { return creep.memory.homeRoom == roomName; });
    var spawns = room.spawns;
    const rcl = room.controller.level;
    let queue;

    //=== What's our main target now ? ===
    //First, we must reach to level 3 ASAP
    if(rcl < 3) {
        //Simple strategy
        // Only spawn upgraders
        queue = [Setup.Upgrader];
    } else {
        //Complex strategy
        //TODO do some optimize here!
        queue = SpawnQueue;
    }

    const trySpawn = function(setupObj, cnt, successCallBack) {
        if(setupObj.shouldSpawn(room, cnt)) {
            spawningStatus = self.spawnWithSetup(spawn, setupObj);
            if(spawningStatus) {
                successCallBack(spawningStatus); //Pass data to callback function
            }
            return true;
        } else {
            return false;
        }
    };

    var cnt = {
        total: 0,
    };
    _.forEach(Role, o => cnt[lowerFirst(o.roleName)] = 0); //Init cnt
    //All role is required
    for(var name in roomCreeps) {
        const creep = roomCreeps[name];
        const role = creep.memory.role;
        cnt[role]++;
        cnt.total++;
    }
    //Try all the spawn
    var spawn = spawns.shift();
    while(spawn) {
        var spawningStatus = false;
        const callback = function(spawningStatus) {
            const roleName = spawningStatus.memory.role;
            cnt[roleName]++;
            cnt.total++;
        };
        for(var index in queue) {
            if(trySpawn(queue[index], cnt, callback)) {
                break;
            }
        }
        spawn = spawns.shift();
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
    const body = this.getMaxiumBody(essBody, extraBody, maxExtraAmount, energyAvailable);
    const bodyCost = this.getBodyCost(body);
    //Check energyAvailable is enough for this spawn action
    if(energyAvailable < bodyCost) return;
    //Calculate name
    const name = prefix+spawn.name+'->'+Game.time;
    memory['homeRoom'] = spawn.room.name;
    const result = spawn.spawnCreep(body, name, {
        memory: memory,
    });
    console.log(`Code[${result}] Spawning ${name}, cost ${bodyCost}, body ${JSON.stringify(body)}`);
    if(result == OK) return Game.creeps[name];
    else return false;
}

const bodyMaxium = 50; //Creep Body Part Maxium Amount
mod.getMaxiumBody = function(essBody, extraBody, maxExtraAmount, energyAvailable) {
    var essCost = this.getBodyCost(essBody);
    var extraCost = this.getBodyCost(extraBody);
    if(extraCost===0) return essBody;

    var extraAmount = _.floor((energyAvailable - essCost) / extraCost);
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

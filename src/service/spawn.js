var mod = {};
module.exports = mod;

mod.loop = function(room) {
    //=== Role count ===
    const roomCreeps = _.filter(Game.creeps, function(creep) { return creep.memory.homeRoom == room.name; });
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

    //=== Decide spawn queue ===
    //Spawn related variable
    const rcl = room.controller.level;
    let urgent = false;
    let queue;
    //Do we have enough incoming energy?
    // that depends on whether we have a pair of havester/hauler at least
    const harC = cnt[lowerFirst(Role.Harvester.roleName)];
    const hauC = cnt[lowerFirst(Role.Hauler.roleName)];
    //And also we should keep at least one upgrader
    const upgC = cnt[lowerFirst(Role.Upgrader.roleName)];
    urgent = !(harC >=1 && hauC>=1 && upgC>=1);
    if(harC < 1) {
        queue = [Setup.Harvester];
    } else if(hauC < 1) {
        queue = [Setup.Hauler];
    } else if(upgC < 1) {
        queue = [Setup.Upgrader];
    } else {
        //Task first since it is issued by humans, and a guardian first to keep room safe.
        const SpawnQueueHigh = [Setup.Task, Setup.Guardian];
        //Harvest more and do something with energy harvested.
        const SpawnQueueNormal = [Setup.Harvester, Setup.Hauler, Setup.Filler];
        //Now build something and upgrade our controller!
        const SpawnQueueLow = [Setup.Builder, Setup.Upgrader];
        queue = _.union(SpawnQueueHigh, SpawnQueueNormal, SpawnQueueLow);
    }

    const self = this;
    const trySpawn = function(setupObj, cnt, successCallBack) {
        if(setupObj.shouldSpawn(room, cnt)) {
            spawningStatus = self.spawnWithSetup(spawn, urgent, setupObj);
            if(spawningStatus) {
                successCallBack(spawningStatus); //Pass data to callback function
            }
            return true;
        } else {
            return false;
        }
    };

    //Try all the spawn
    var spawns = room.spawns;
    var spawn = spawns.shift();
    while(spawn) {
        var spawningStatus = false;
        const callback = function(spawningStatus) {
            const roleName = spawningStatus.memory.role;
            cnt[roleName]++;
            cnt.total++;
        };
        for(var index in queue) {
            //If urgent, then try first one and break loop
            // otherwise, try util spawn successed
            if(trySpawn(queue[index], cnt, callback) || urgent) {
                break;
            }
        }
        spawn = spawns.shift();
    }

    Util.Stat.memorize('last-creeps-cnt', cnt);
};

//When incoming energy of spawn is low, then spawn of worker/harvester-hauler
//  is urgent, otherwise it is not urgent, we can wait for it to be bigger.
mod.spawnWithSetup = function(spawn, urgent=true, {setupConfig, shouldUseHighLevel}) {
    if(spawn.spawning) return;

    const energyAvailable = spawn.room.energyAvailable;
    let energyForSpawnCapacity = spawn.room.energyAvailable;
    var setup;
    if(shouldUseHighLevel === undefined) setup = setupConfig.Normal;
    else setup = shouldUseHighLevel(spawn.room) ? setupConfig.High : setupConfig.Normal;
    //For low energy available, use SetupConfig.Low
    if(energyAvailable < setupConfig.Normal.minEnergy && !!setupConfig.Low) {
        setup = setupConfig.Low;
    }
    var {minEnergy, essBody, extraBody, prefix, memory, maxExtraAmount} = setup;

    //Calculate body and examine whether energyAvailable is enough
    //If it is not urgent, then use energyCapacityAvailable to calculate
    //  maxiumBody, throught this we achieved "Wait For Bigger Single Creep"
    if(!urgent) energyForSpawnCapacity = spawn.room.energyCapacityAvailable;
    const body = this.getMaxiumBody(essBody, extraBody, maxExtraAmount, energyForSpawnCapacity);
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
};

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
};

mod.getBodyCost = function(bodyParts) {
    var cost = 0;
    for(var i=0; i<bodyParts.length; i++) {
        cost += BODYPART_COST[bodyParts[i]];
    }
    return cost;
};

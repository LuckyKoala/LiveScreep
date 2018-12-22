var mod = {};
module.exports = mod;

mod.loop = function(room) {
    //Try all the spawn
    let spawns = room.spawns;
    for(let spawn of spawns) {
        if(room.queue.urgent.length > 0) {
            if(this.spawnWithSetup(spawn, true, Setup[room.queue.urgent[0]])) {
                room.queue.urgent.shift();
            }
        } else if(room.queue.normal.length > 0) {
            if(this.spawnWithSetup(spawn, false, Setup[room.queue.normal[0]])) {
                room.queue.normal.shift();
            }
        }
    }
};

// Return true indicates that creep can be created
//When incoming energy of spawn is low, then spawn of worker/harvester-hauler
//  is urgent, otherwise it is not urgent, we can wait for it to be bigger.
mod.spawnWithSetup = function(spawn, urgent, {setupConfig, shouldUseHighLevel}) {
    if(spawn.spawning) return false;

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
    if(energyAvailable < bodyCost) return false;
    //Calculate name
    const name = prefix+spawn.name+'->'+Game.time;
    memory['homeRoom'] = spawn.room.name;
    const result = spawn.spawnCreep(body, name, {
        memory: memory,
    });
    console.log(`Code[${result}] Spawning ${name}, cost ${bodyCost}, body ${JSON.stringify(body)}`);
    if(result == OK) {
        Util.Stat.incEnergyOut(spawn.room.name, bodyCost);
        return true;
    }
    return false;
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

let mod = {};
module.exports = mod;

mod.loop = function(room) {
    //Try all the spawn
    let spawns = room.spawns;
    let usedEnergyAmount = 0;
    for(let spawn of spawns) {
        if(room.queue.urgent.length > 0) {
            const usedEnergy = spawnWithSetup(spawn, usedEnergyAmount, true, Setup[room.queue.urgent[0]]);
            if(usedEnergy !== false) {
                room.queue.urgent.shift();
                usedEnergyAmount+=usedEnergy;
            }
        } else if(room.queue.normal.length > 0) {
            const usedEnergy = spawnWithSetup(spawn, usedEnergyAmount, false, Setup[room.queue.normal[0]]);
            if(usedEnergy !== false) {
                room.queue.normal.shift();
                usedEnergyAmount+=usedEnergy;
            }
        } else if(room.queue.extern.length > 0) {
            //Different setup format
            // [setupName, {destinedTarget: 'sim'}]
            //  aka a array of setupName and extra memory
            const setupArr = room.queue.extern[0];
            const setup = Setup[setupArr[0]];
            let extraMemory = setupArr[1];
            const usedEnergy = spawnWithSetup(spawn, usedEnergyAmount, false, setup, extraMemory);
            if(usedEnergy !== false) {
                room.queue.extern.shift();
                usedEnergyAmount+=usedEnergy;
            }
        }
    }
};

// Return true indicates that creep can be created
//When incoming energy of spawn is low, then spawn of worker/harvester-hauler
//  is urgent, otherwise it is not urgent, we can wait for it to be bigger.
function spawnWithSetup (spawn, usedEnergyAmount, urgent, {dynamicExtraAmount, setupConfig, shouldUseHighLevel}, extraMemory) {
    if(spawn.spawning) {
        return false;
    }

    const energyAvailable = spawn.room.energyAvailable;
    let dynamicMaxExtraAmount = false;
    let setup;
    if(shouldUseHighLevel === undefined) setup = setupConfig.Normal;
    else {
        if(shouldUseHighLevel(spawn.room)) {
            setup = setupConfig.High;
        } else {
            if(dynamicExtraAmount) {
                dynamicMaxExtraAmount = dynamicExtraAmount(spawn.room);
            }
            setup = setupConfig.Normal;
        }
    }
    //For low energy available, use SetupConfig.Low
    if(energyAvailable < setupConfig.Normal.minEnergy && !!setupConfig.Low) {
        setup = setupConfig.Low;
    }
    const {minEnergy, essBody, extraBody, prefix, memory, maxExtraAmount} = setup;

    //If it is not urgent, then use energyCapacityAvailable to calculate
    //  maxiumBody, throught this we achieved "Wait For Bigger Single Creep"
    let energyForSpawnCapacity = spawn.room.energyAvailable-usedEnergyAmount;
    if(!urgent) energyForSpawnCapacity = spawn.room.energyCapacityAvailable-usedEnergyAmount;
    
    //Calculate body and examine whether energyAvailable is enough
    let body;
    if(dynamicMaxExtraAmount) {
        body = getMaxiumBody(essBody, extraBody, dynamicMaxExtraAmount, energyForSpawnCapacity);
    } else {
        body = getMaxiumBody(essBody, extraBody, maxExtraAmount, energyForSpawnCapacity);
    }
    const bodyCost = Util.Helper.getBodyCost(body);
    //Check energyAvailable is enough for this spawn action
    if(energyAvailable < bodyCost) {
        //Logger.debug(`[${spawn.room.name}-${spawn.name}] energy is not enough while spawning creep with body:${JSON.stringify(body)} and memory:${JSON.stringify(memory)} which cost ${bodyCost}, energyAvailable: ${energyAvailable}`);
        return false;
    }
    //Calculate name
    const name = prefix+spawn.name+'->'+Game.time;
    //Inject memory
    memory['homeRoom'] = spawn.room.name;
    if(extraMemory) {
        for(const key in extraMemory) {
            memory[key] = extraMemory[key];
        }
    }
    const result = spawn.spawnCreep(body, name, {
        memory: memory,
    });
    Logger.trace(`Code[${result}] Spawning ${name}, cost ${bodyCost}, body ${JSON.stringify(body)}`);
    if(result == OK) {
        Util.Stat.incEnergyOut(spawn.room.name, bodyCost);
        return bodyCost;
    } else {
        Logger.debug(`[${spawn.room.name}-${spawn.name}] Err Code ${result} while spawning ${name} with body:${JSON.stringify(body)} and memory:${JSON.stringify(memory)} which cost ${bodyCost}`);
        return false;
    }
};

const bodyMaxium = 50; //Creep Body Part Maxium Amount
function getMaxiumBody (essBody, extraBody, maxExtraAmount, energyAvailable) {
    const essCost = Util.Helper.getBodyCost(essBody);
    const extraCost = Util.Helper.getBodyCost(extraBody);
    if(extraCost===0) return essBody;

    let extraAmount = _.floor((energyAvailable - essCost) / extraCost);
    if(!!maxExtraAmount && extraAmount>maxExtraAmount) extraAmount = maxExtraAmount;
    const remainAmount = _.floor((bodyMaxium-essBody.length) / extraBody.length);
    if(extraAmount > remainAmount) extraAmount = remainAmount;

    const body = _.cloneDeep(essBody);
    for(let i=0; i<extraAmount; i++) {
        body.push(extraBody);
    }
    return _.flattenDeep(body);
};

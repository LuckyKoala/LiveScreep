var mod = {};
module.exports = mod;

mod.loop = function(room) {
    //=== Role count ===
    const roomCreeps = _.filter(Game.creeps, function(creep) { return creep.memory.homeRoom == room.name; });
    let cnt = {
        total: 0,
    };
    _.forEach(Role, o => cnt[o.roleName] = 0); //Init cnt
    //Count role existed
    for(let creep of roomCreeps) {
        const role = creep.memory.role;
        cnt[role]++;
        cnt.total++;
    }
    let canKeepSpawning = false;
    if(room.storage && room.storage.store[RESOURCE_ENERGY] > 20000) {
        //We still have energy in storage
        // Do we have a filler to transfer energy from storage to spawns/extensions?
        if(cnt[C.FILLER]>=1) canKeepSpawning = true;
    }
    //Count role in queue as well
    const queue = room.queue.urgent.concat(room.queue.normal);
    for(let setupName of queue) {
        const role = setupName;
        cnt[role]++;
        cnt.total++;
    }

    //=== Minimal group of creeps to keep room running ===
    // At least one harvester,one hauler and one filler
    if(cnt[C.HARVESTER] < 1) {
        if(canKeepSpawning) room.queue.normal.push(C.HARVESTER);
        else room.queue.urgent.push(C.HARVESTER);
        cnt[C.HARVESTER]++;
    }
    if(cnt[C.HAULER] < 1) {
        if(canKeepSpawning) room.queue.normal.push(C.HAULER);
        else room.queue.urgent.push(C.HAULER);
        cnt[C.HAULER]++;
    }
    if(room.storage && cnt[C.FILLER] < 1) {
        if(canKeepSpawning) room.queue.normal.push(C.FILLER);
        else room.queue.urgent.push(C.FILLER);
        cnt[C.FILLER]++;
    }

    //=== A keeper to redistribute neccessary energy ===
    if(room.storage) {
        if(cnt[C.KEEPER] < 1) {
            //No need to hurry
            room.queue.normal.push(C.KEEPER);
            cnt[C.KEEPER]++;
        }
    }

    //=== Harvest all sources and spawn dedicated hauler if no associated source link present
    //That is one pair of harvester-hauler per source
    // or one pair of harvester-link per source
    let needHarvester = room.sources.length - cnt[C.HARVESTER];
    let needHauler = room.sources.length - room.sourceLinks.length - cnt[C.HAULER];
    //Actually enqueue harvesters and haulers
    while(needHarvester-- > 0) {
        room.queue.normal.push(C.HARVESTER);
        cnt[C.HARVESTER]++;
        //Spawn matched hauler
        if(needHauler-- > 0) {
            room.queue.normal.push(C.HAULER);
            cnt[C.HAULER]++;
        }
    }
    //If harvester is enough and hauler is not enough
    // just spawn it alone
    while(needHauler-- > 0) {
        room.queue.normal.push(C.HAULER);
        cnt[C.HAULER]++;
    }

    //=== Others ===
    //If there are sites need to be build or structures need to be maintain,
    //  spawn a builder.
    const needBuildStructures = room.cachedFind(FIND_CONSTRUCTION_SITES);
    const needRepairStructures = room.cachedFind(FIND_STRUCTURES, {
        filter: function(o) {
            return o.hits < o.hitsMax;
        }
    });
    const needBuilder = (needBuildStructures.length + needRepairStructures.length) > 0;
    if(needBuilder && cnt[C.BUILDER]<1) {
            room.queue.normal.push(C.BUILDER);
            cnt[C.BUILDER]++;
    }

    //Spawn a guardian if it is neccessary -> goto util.defense
    if(cnt[C.GUARDIAN] === 0 && Util.Defense.shouldSpawnGuardian(room)) {
        room.queue.normal.push(C.GUARDIAN);
        cnt[C.GUARDIAN]++;
    }

    //If no storage, push keeper in queue in the last
    // because it will wait for hauler to give it energy
    //  and hauler won't do that unless no creep in spawn queue
    //  if we spawn it before other creeps, keepers may stuck at door of spawn
    if(!room.storage) {
        //No storage, so keeper is a kind of storage
        if(cnt[C.KEEPER] < 1) {
            //No need to hurry
            room.queue.normal.push(C.KEEPER);
            cnt[C.KEEPER]++;
        }
    }

    const energyForSpawnCapacity = room.energyCapacityAvailable;
    const dynamicMaxExtraAmount = Setup[C.UPGRADER].dynamicExtraAmount(room);
    const totalEnergyNeed = 650+dynamicMaxExtraAmount*700;
    //Currently energy capacity can't afford single bigger creep
    // so let's add amount of upgraders
    let upgraderAmount = Math.floor(totalEnergyNeed/energyForSpawnCapacity);
    upgraderAmount = Math.min(3, upgraderAmount); // 3 at most, more creep more cpu and more crowded
    if(needBuildStructures.length>0 && cnt[C.UPGRADER] < upgraderAmount) {
        room.queue.normal.push(C.UPGRADER);
        cnt[C.UPGRADER]++;
    }
};

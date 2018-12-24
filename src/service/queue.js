var mod = {};
module.exports = mod;

mod.loop = function(room) {
    //=== Role count ===
    const roomCreeps = _.filter(Game.creeps, function(creep) { return creep.memory.homeRoom == room.name; });
    let cnt = {
        total: 0,
    };
    _.forEach(Role, o => cnt[o.roleName] = 0); //Init cnt
    //All role is required
    for(let creep of roomCreeps) {
        const role = creep.memory.role;
        cnt[role]++;
        cnt.total++;
    }
    //Count role in queue as well
    const queue = _.union(room.queue.urgent, room.queue.normal);
    for(let setupName of queue) {
        const role = setupName;
        cnt[role]++;
        cnt.total++;
    }

    //=== Minimal group of creeps to keep room running ===
    // At least one harvester,one hauler and one upgrader
    if(cnt['Harvester'] < 1) {
        room.queue.urgent.push(Setup.Harvester.setupName);
        cnt['Harvester']++;
    }
    if(cnt['Hauler'] < 1) {
        room.queue.urgent.push(Setup.Hauler.setupName);
        cnt['Hauler']++;
    }
    if(cnt['Upgrader'] < 1) {
        room.queue.urgent.push(Setup.Upgrader.setupName);
        cnt['Upgrader']++;
    }
    //If there is a storage, spawn a filler to redistribute
    //  resources in storage
    if(room.storage && cnt['Filler'] === 0) {
        room.queue.urgent.push(Setup.Filler.setupName);
        cnt['Filler']++;
    }

    //=== Harvest all sources and spawn dedicated hauler if no associated source link present
    //That is one pair of harvester-hauler per source
    // or one pair of harvester-link per source
    let needHarvester = room.sources.length - cnt['Harvester'];
    let needHauler = room.sources.length - room.sourceLinks.length - cnt['Hauler'];
    //Actually enqueue harvesters and haulers
    while(needHarvester-- > 0) {
        room.queue.normal.push(Setup.Harvester.setupName);
        cnt['Harvester']++;
        //Spawn matched hauler
        if(needHauler-- > 0) {
            room.queue.normal.push(Setup.Hauler.setupName);
            cnt['Hauler']++;
        }
    }
    //If harvester is enough and hauler is not enough
    // just spawn it alone
    while(needHauler-- > 0) {
        room.queue.normal.push(Setup.Hauler.setupName);
        cnt['Hauler']++;
    }

    //=== Others ===
    //If there are sites need to be build or structures need to be maintain,
    //  spawn a builder for room without storage
    //  spawn two builder from room with storage(> 20000 energy remain)
    const needBuildStructures = room.cachedFind(FIND_CONSTRUCTION_SITES);
    const needRepairStructures = room.cachedFind(FIND_STRUCTURES, {
        filter: function(o) {
            return o.hits < o.hitsMax;
        }
    });
    const needBuilder = (needBuildStructures.length + needRepairStructures.length) > 0;
    if(needBuilder) {
        if(cnt['Builder']===0) {
            room.queue.normal.push(Setup.Builder.setupName);
            cnt['Builder']++;
        } else if(cnt['Builder']===1 && room.storage && room.storage.store[RESOURCE_ENERGY] > 20000) {
            room.queue.normal.push(Setup.Builder.setupName);
            cnt['Builder']++;
        }
    }
    //Spawn a guardian if it is neccessary -> goto util.defense
    if(cnt['Guardian'] === 0 && Util.Defense.shouldSpawnGuardian(room)) {
        room.queue.urgent.push(Setup.Guardian.setupName);
        cnt['Guardian']++;
    }

    //=== Dynamic balance ===
    if(queue.length === 0 && !room.storage && (Game.time-room.queue.lastBalanceTick) > HISTORY_RESET_TICK) {
        //Refresh check time
        room.queue.lastBalanceTick = Game.time;
        //All base creep has been spawned, no creep in the queue
        // No storage to store extra energy or
        //   to compensate lack of energy, find a way to balance it!
        //Now let's see we have more energyIn or energyOut
        //Adjust queue depends on avg in and out
        const lastHistory = Util.Stat.getLastHistory(room.name);
        const energyIn = lastHistory.lastAvgIn;
        const energyOut = lastHistory.lastAvgOut;
        const hasMoreEnergy = (energyIn - energyOut) > 0;
        const hasLessEnergy = (energyIn - energyOut) < 0;
        console.log(`In ${energyIn}, Out ${energyOut}, hasMoreEnergy ${hasMoreEnergy}`);
        if(hasMoreEnergy) {
            //Firstly, do we need builder?
            // if there are sites need to be build,
            //  then one builder more is enough
            if(needBuilder && needBuildStructures.length>1 && cnt['builder']<2) {
                //Add a builder
                console.log('More builder!');
                room.queue.normal.push(Setup.Builder.setupName);
                cnt['Builder']++;
                return;
            }
            //Secondly, more upgrader is always good
            // if and only if controller container can afford
            if(room.controller.container && room.controller.container.store[RESOURCE_ENERGY] > 500) {
                console.log('More upgrader!');
                room.queue.normal.push(Setup.Upgrader.setupName);
                cnt['Upgrader']++;
            }
        } else if(hasLessEnergy) {
            //Can we gain more energy ?
            //1. add harvester in room
            //NOTE this is bad idea since more harvester will break source mark system
            // and consequence is two 5xWORK harvester may mining same source
            //console.log('More harvester!');
            //room.queue.normal.push(Setup.Harvester);
            //cnt['harvester']++;
            //2. add remote mining harvester
        }
    }
};

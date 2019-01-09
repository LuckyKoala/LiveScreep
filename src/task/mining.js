var mod = {};
module.exports = mod;

mod.loop = function() {
    const flags = _.filter(Game.flags, o => FlagUtil.mining.examine(o));
    for(const flag of flags) {
        const room = flag.room;
        if(room) {
            //We do have vision
            this.queueCreeps(room);
        } else {
            //No vision
            // but this flag should only place in base room!
            Logger.warning(`Found mining(base) flag[${flag.name}] in no-vision room[${flag.roomName}]!`);
        }
    }
};

//Harvester and hauler
mod.queueCreeps = function(room) {
    //=== Role count ===
    const cnt = room.cachedRoleCount();

    //=== Can we keep spawning? ===
    let canKeepSpawning = false;
    if(room.storage && room.storage.store[RESOURCE_ENERGY] > 20000) {
        //We still have energy in storage
        // Do we have a filler to transfer energy from storage to spawns/extensions?
        if(cnt.existed[C.FILLER]>=1) canKeepSpawning = true;
    }

    //=== Minimal group of creeps to keep room running ===
    // At least one harvester,one hauler
    //  If there is a storage, task.spawning will make use of it
    if(cnt.total[C.HARVESTER] < 1) {
        if(canKeepSpawning) room.queue.normal.push(C.HARVESTER);
        else room.queue.urgent.push(C.HARVESTER);
        cnt.queue[C.HARVESTER]++;
        cnt.total[C.HARVESTER]++;
    }
    if(cnt.total[C.HAULER] < 1) {
        if(canKeepSpawning) room.queue.normal.push(C.HAULER);
        else room.queue.urgent.push(C.HAULER);
        cnt.queue[C.HAULER]++;
        cnt.total[C.HAULER]++;
    }

    //=== Harvest all sources and spawn dedicated hauler if no associated source link present
    //That is one pair of harvester-hauler per source
    // or one pair of harvester-link per source
    let needHarvester;
    let needHauler;
    if(room.controller.level < 3) {
        //=== Calculate ===
        //carry work move
        //1. carry with energy(move 1 tile 2 tick)
        //2. carry with energy(move 1 tile 1 tick)
        // so avg move speed is 1.5 tile/tick
        const factor = 1.5;
        let range = 0;
        for(let source of room.sources) {
            range += room.spawns[0].pos.getRangeTo(source);
            range += room.controller.pos.getRangeTo(source);
        }
        const ticksPerRound = Math.ceil(range*2/room.sources.length/factor);
        //const energyGenPerTick = SOURCE_ENERGY_CAPACITY/ENERGY_REGEN_TIME;
        const energyGenPerTick = 2*HARVEST_POWER;
        const carryPerRound = 2*CARRY_CAPACITY;
        const amountFactor = Math.ceil(energyGenPerTick*ticksPerRound/carryPerRound);
        needHauler = 1*amountFactor - cnt.total[C.HAULER];
        needHarvester = room.sources.length - cnt.total[C.HARVESTER];
    } else {
        //one pair for all sources
        // reuse harvester and save cpu
        needHauler = 1 - room.sourceLinks.length - cnt.total[C.HAULER];
        needHarvester = 1 - cnt.total[C.HARVESTER];
    }
    //Actually enqueue harvesters and haulers
    while(needHarvester-- > 0) {
        room.queue.normal.push(C.HARVESTER);
        cnt.queue[C.HARVESTER]++;
        cnt.total[C.HARVESTER]++;
        //Spawn matched hauler
        if(needHauler-- > 0) {
            room.queue.normal.push(C.HAULER);
            cnt.queue[C.HAULER]++;
            cnt.total[C.HAULER]++;
        }
    }
    //If harvester is enough and hauler is not enough
    // just spawn it alone
    while(needHauler-- > 0) {
        room.queue.normal.push(C.HAULER);
        cnt.queue[C.HAULER]++;
        cnt.total[C.HAULER]++;
    }

    //=== Harvest mineral if possible ===
    if(cnt.total[C.MINER]===0 && room.mineral && room.mineral.extractor && room.mineral.mineralAmount>0) {
        room.queue.normal.push(C.MINER);
        cnt.queue[C.MINER]++;
        cnt.total[C.MINER]++;
    }
    //Does miner has dedicated hauler?
    const needExtraHaulerCnt = cnt.total[C.HAULER] - cnt.total[C.MINER] - (room.sources.length - room.sourceLinks.length);
    if(needExtraHaulerCnt<0) {
        //Haulers is matched with harvesters
        room.queue.normal.push(C.HAULER);
        cnt.queue[C.HAULER]++;
        cnt.total[C.HAULER]++;
    }
};

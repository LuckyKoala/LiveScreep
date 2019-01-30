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
    const storage = room.storage || room.terminal;
    if(storage && storage.store[RESOURCE_ENERGY] > 20000) {
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
        return;
    }
    if(cnt.total[C.HAULER] < 1) {
        if(canKeepSpawning) room.queue.normal.push(C.HAULER);
        else room.queue.urgent.push(C.HAULER);
        cnt.queue[C.HAULER]++;
        cnt.total[C.HAULER]++;
        return;
    }

    //=== Harvest all sources and spawn dedicated hauler if no associated source link present
    //That is one pair of harvester-hauler per source
    // or one pair of harvester-link per source
    //one pair for all sources
    // reuse harvester and save cpu
    let harvesterLimit;
    let haulerLimit = room.sources.length;
    const fiveWorkCost = Setup[C.HARVESTER].setupConfig.Normal.minEnergy;
    if(room.energyCapacityAvailable>=fiveWorkCost) {
        //Normal RCL, one 5xWORK harvester per source
        harvesterLimit = room.sources.length;
    } else {
        //Low RCL, more little harvester
        let accessibleFields = 0;
        for(let source of room.sources) {
            accessibleFields += source.accessibleFields;
        }
        //FIXME harvester no longer use dynamic source mark! More than one harvester at a source won't work any more
        harvesterLimit = accessibleFields;
        haulerLimit = 2*room.sources.length;
    }
    //We assume sourceLink -> storageLink -> sourceLink
    let sourceLinkLength = 0;
    if(room.links.length >= 3) {
        sourceLinkLength = 2;
    } else if(room.links.length >= 2) {
        sourceLinkLength = 1;
    }
    let needHauler = haulerLimit - sourceLinkLength - cnt.total[C.HAULER];
    let needHarvester = harvesterLimit - cnt.total[C.HARVESTER];
    //Actually enqueue harvesters and haulers
    while(needHarvester-->0) {
        room.queue.normal.push(C.HARVESTER);
        cnt.queue[C.HARVESTER]++;
        cnt.total[C.HARVESTER]++;
        while(needHauler-->0) {
            room.queue.normal.push(C.HAULER);
            cnt.queue[C.HAULER]++;
            cnt.total[C.HAULER]++;
        }
    }
    while(needHauler-->0) {
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
    const needExtraHaulerCnt = cnt.total[C.HAULER] - cnt.total[C.MINER] - (room.sources.length - sourceLinkLength);
    if(needExtraHaulerCnt<0) {
        //Haulers is matched with harvesters
        room.queue.normal.push(C.HAULER);
        cnt.queue[C.HAULER]++;
        cnt.total[C.HAULER]++;
    }
};

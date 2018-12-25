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
    const queue = room.queue.urgent.concat(room.queue.normal);
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
        //No need to hurry
        room.queue.normal.push(Setup.Upgrader.setupName);
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
    //  spawn a builder.
    const needBuildStructures = room.cachedFind(FIND_CONSTRUCTION_SITES);
    const needRepairStructures = room.cachedFind(FIND_STRUCTURES, {
        filter: function(o) {
            return o.hits < o.hitsMax;
        }
    });
    const needBuilder = (needBuildStructures.length + needRepairStructures.length) > 0;
    if(needBuilder && cnt['Builder']===0) {
            room.queue.normal.push(Setup.Builder.setupName);
            cnt['Builder']++;
    }
    //Spawn a guardian if it is neccessary -> goto util.defense
    if(cnt['Guardian'] === 0 && Util.Defense.shouldSpawnGuardian(room)) {
        room.queue.urgent.push(Setup.Guardian.setupName);
        cnt['Guardian']++;
    }
};

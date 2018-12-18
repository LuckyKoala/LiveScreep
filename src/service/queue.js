var mod = {};
module.exports = mod;

mod.loop = function(room) {
    //=== Role count ===
    const roomCreeps = _.filter(Game.creeps, function(creep) { return creep.memory.homeRoom == room.name; });
    let cnt = {
        total: 0,
    };
    _.forEach(Role, o => cnt[lowerFirst(o.roleName)] = 0); //Init cnt
    //All role is required
    for(let creep of roomCreeps) {
        const role = creep.memory.role;
        cnt[role]++;
        cnt.total++;
    }
    //Count role in queue as well
    for(let setup of _.union(room.queue.urgent, room.queue.normal)) {
        const role = lowerFirst(setup.setupName);
        cnt[role]++;
        cnt.total++;
    }
    //=== Base creeps ===
    //One pair of harvester-hauler per source
    let needHarvester = room.sources.length - cnt['harvester'];
    let needHauler = room.sources.length - cnt['hauler'];
    while(needHarvester-- > 0) {
        if(cnt['harvester']===0) {
            //No harvester at all, so it's urgent
            room.queue.urgent.push(Setup.Harvester);
        } else {
            room.queue.normal.push(Setup.Harvester);
        }
        cnt['harvester']++;
        if(needHauler-- > 0) {
            if(cnt['hauler']===0) {
                //No hauler at all, so it's urgent
                room.queue.urgent.push(Setup.Hauler);
            } else {
                room.queue.normal.push(Setup.Hauler);
            }
            cnt['hauler']++;
        }
    }
    //One upgrader in queue.urgent and one in queue.normal
    let upgraderCnt = cnt['upgrader'];
    if(upgraderCnt === 0) {
        room.queue.urgent.push(Setup.Upgrader);
        cnt['upgrader']++;
    } else if(upgraderCnt === 1) {
        room.queue.normal.push(Setup.Upgrader);
        cnt['upgrader']++;
    }
    //=== Extended creeps ===
    //If there is a storage, spawn a filler and a extra hauler
    if(room.storage) {
        if(cnt['filler'] === 0) {
            room.queue.urgent.push(Setup.Filler);
            cnt['filler']++;
        }
        if(cnt['hauler'-room.sources.length] === 0) {
            room.queue.normal.push(Setup.Hauler);
            cnt['hauler']++;
        }
    }
    //If there are sites need to be build or structures need to be maintain,
    //  spawn a builder for room without storage
    //  spawn two builder from room with storage
    const needBuildStructures = room.find(FIND_CONSTRUCTION_SITES);
    const needRepairStructures = room.find(FIND_STRUCTURES, {
        filter: function(o) {
            return o.hits < o.hitsMax;
        }
    });
    const needBuilder = (needBuildStructures.length + needRepairStructures.length) > 0;
    if(needBuilder) {
        if(cnt['builder']===0) {
            room.queue.normal.push(Setup.Builder);
            cnt['builder']++;
        } else if(cnt['builder']===1 && room.storage) {
            room.queue.normal.push(Setup.Builder);
            cnt['builder']++;
        }
    }
    //If there is tower spawn a guardian -> goto util.defense
    if(cnt['guardian'] === 0 && Util.Defense.shouldSpawnGuardian(room)) {
        room.queue.urgent.push(Setup.Guardian);
        cnt['guardian']++;
    }
};

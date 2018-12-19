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
    const queue = _.union(room.queue.urgent, room.queue.normal);
    for(let setup of queue) {
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
    //If harvester is enough and hauler is not enough
    // just spawn it alone
    while(needHauler-- > 0) {
        if(cnt['hauler']===0) {
            //No hauler at all, so it's urgent
            room.queue.urgent.push(Setup.Hauler);
        } else {
            room.queue.normal.push(Setup.Hauler);
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
    // or if there is a controllerContainer, spawn a extra hauler
    if(room.storage) {
        if(cnt['filler'] === 0) {
            room.queue.urgent.push(Setup.Filler);
            cnt['filler']++;
        }
        if(cnt['hauler']-room.sources.length === 0) {
            room.queue.normal.push(Setup.Hauler);
            cnt['hauler']++;
        }
    } else if(room.controller.container) {
        if(cnt['hauler']-room.sources.length === 0) {
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

    //=== Dynamic balance ===
    if(queue.length === 0 && !room.storage && (Game.time-room.queue.lastBalanceTick) > 100) {
        //All base creep has been spawned, no creep in the queue
        // No storage to store extra energy or
        //   to compensate lack of energy, find a way to balance it!
        //Now let's see we have more energyIn or energyOut
        const energyIn = Util.Stat.energyIn();
        const energyOut = Util.Stat.energyOut();
        const hasMoreEnergy = (energyIn - energyOut) > 0;
        if(hasMoreEnergy) {
            //Firstly, do we need builder?
            // if there are sites need to be build,
            //  then one builder more is enough
            if(needBuilder && needBuildStructures.length>1 && cnt['builder']<2) {
                //Add a builder
                console.log('More builder!');
                room.queue.normal.push(Setup.Builder);
                cnt['builder']++;
                room.queue.lastBalanceTick = Game.time;
                return;
            }
            //Secondly, more upgrader is always good
            // if and only if controller container can afford
            if(room.controller.container && room.controller.container.store[RESOURCE_ENERGY] > 500) {
                console.log('More upgrader!');
                room.queue.normal.push(Setup.Upgrader);
                cnt['upgrader']++;
                room.queue.lastBalanceTick = Game.time;
            }
        } else {
            //Can we gain more energy ?
            //1. add harvester in room
            console.log('More harvester!');
            room.queue.normal.push(Setup.Harvester);
            cnt['harvester']++;
            room.queue.lastBalanceTick = Game.time;
            //2. add remote mining harvester
        }
    }
};

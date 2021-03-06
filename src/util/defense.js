//War logic goes there
var mod = {};
module.exports = mod;

const RampartMaintainThreshold = Config.RampartMaintainThreshold;
const WallMaintainThreshold = 300*Thousand;
const ThreatValue = {
    tough: 1,
    attack: 2,
    ranged_attack: 3,
    work: 4,
    heal: 5,
};

mod.threatValue = {};

mod.tryActivateSafeMode = function(room) {
    if(room.controller.safeMode) {
        //Safe mode is on already
        return;
    }
    if(room.controller && room.controller.my) {
        const hostiles = room.cachedFind(FIND_HOSTILE_CREEPS);
        if(hostiles.length > 0) {
            //So there are some invader
            // Do we have towers which can still run for a tick at least?
            let towers = _.filter(room.cachedFind(FIND_MY_STRUCTURES), (structure) => {
                return (structure.structureType == STRUCTURE_TOWER) &&
                    structure.energy >= TOWER_ENERGY_COST;
            });
            if(towers.length > 0) {
                //Yes, we do have working towers
                // Then maybe we can survive from these invaders
                //  Do nothing for now
                //TODO spawn more guardian
            } else {
                //No, no working towers
                // Then we have to assume this room may not survive
                //  Try active safe mode.
                if(room.controller.safeModeAvailable > 0) {
                    const notified = room.memory.notifiedTime || 0;
                    if(room.controller.safeModeCooldown) {
                        //Safe mode is still cool down, dangerous!
                        if((Game.time-notified)>3000) {
                            Game.notify(`[${time}]Threat coming,safe mode is cooling down!!!`, 0);
                            room.memory.notifiedTime = Game.time;
                        }
                    } else {
                        //Just activate it!
                        const time = Game.time;
                        const result = room.controller.activateSafeMode()
                        const message = result===OK ? 'activated' : 'failed to activate';
                        if((Game.time-notified)>3000) {
                            Game.notify(`[${time}]Threat coming,${message} safe mode!!!`, 0);
                            room.memory.notifiedTime = Game.time;
                        }
                    }
                }
            }

        }
    }
};

mod.getRampartSitesCanBuild = function(room, energyAvailable) {
    return _.filter(room.cachedFind(FIND_CONSTRUCTION_SITES), function(o) {
        //Only build rampart if this builder can maintain it to low bound
        return o.structureType==STRUCTURE_RAMPART
            && energyAvailable >= RampartMaintainThreshold.Lowest/REPAIR_POWER;  //Currently 10K/100=100Energy
    });
};

mod.getRampartsForMaintain = function(room) {
    return _.filter(room.cachedFind(FIND_MY_STRUCTURES), function(o) {
        return o.structureType==STRUCTURE_RAMPART && o.hits<RampartMaintainThreshold.Low;
    });
};

mod.canReleaseRampart = function(hits) {
    return hits>=RampartMaintainThreshold.Normal;
};

//Attention: Wall is not OwnedStructure
mod.getWallsForMaintain = function(room) {
    return _.filter(room.cachedFind(FIND_STRUCTURES), function(o) {
        return o.structureType==STRUCTURE_WALL && o.hits<WallMaintainThreshold;
    });
};

mod.canReleaseWall = function(hits) {
    return hits>=WallMaintainThreshold;
};

mod.getBodypartsCnt = function(creep) {
    var data = {};
    _.forEach(BODYPART_COST, (value, key) => {
        data[key] = creep.getActiveBodyparts(key);
    });
    return data;
};

mod.sortHostilesByRoom = function(room) {
    const self = this;
    const hostiles = room.cachedFind(FIND_HOSTILE_CREEPS);
    const hostileMap = _.map(hostiles, o => {
        const cnt = self.getBodypartsCnt(o);
        return {
            threat: self.sumThreatValueByCnt(cnt),
            id: o.id,
        };
    });
    return _.sortBy(hostileMap, ['threat', 'id']);
};

mod.sumThreatValueByCnt = function(bodypartsCnt) {
    var sum = 0;
    _.forEach(bodypartsCnt, (cnt, type) => {
        var threatValue = ThreatValue[type];
        if(!_.isUndefined(threatValue)) {
            sum+=threatValue*cnt;
        }
    });
    return sum;
};

//TODO honour boost part
//TODO if there is only healer, don't count it?
mod.sumThreatValueByBody = function(body) {
    var value = 0;
    for(var i=0; i<body.length; i++) {
        var part = body[i];
        if(part.hits > 0) {
            var v = ThreatValue[part.type];
            if(!_.isUndefined(v)) value+=v;
        }
    }
    return value;
};

mod.getCurrentThreatValue = function(room) {
    const self = this;
    const hostiles = room.cachedFind(FIND_HOSTILE_CREEPS);
    return _.sum(_.map(hostiles, o => self.sumThreatValueByBody(o.body))); //sumBy
};

mod.sortHostilesByPos = function(room, pos) {
    const self = this;
    const hostiles = room.cachedFind(FIND_HOSTILE_CREEPS);
    const hostileMap = _.map(hostiles, o => {
        const cnt = self.getBodypartsCnt(o);
        return {
            threat: self.sumThreatValueByCnt(cnt),
            range: pos.getRangeTo(o),
            id: o.id,
        };
    });
    return _.sortBy(hostileMap, ['threat', 'range', 'id']);
};

//TODO Calculate suitable body parts for spawner to spawn guardian
mod.shouldSpawnGuardian = function(room) {
    return true;
    /*
    let towers = room.find(FIND_MY_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType == STRUCTURE_TOWER) &&
            structure.energy > Config.EnergyForDefend;
      }
    });
    //If there is a tower at least, then we can generate a guardian to help it
    if(towers.length>=1 && this.threatValue[room.name]>=0) return true;
    else return false;
    */
};

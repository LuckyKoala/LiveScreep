//War logic goes there
var mod = {};
module.exports = mod;

const RampartMaintainThreshold = Config.RampartMaintainThreshold;
const WallMaintainThreshold = 300*Thousand; 
const ThreatValue = {
    tough: 1,
    ranged_attack: 2,
    attack: 3,
    work: 4,
    heal: 5,
};

mod.loop = function(room) {
    //Do nothing
};

mod.getRampartSitesCanBuild = function(room, energyAvailable) {
    return room.find(FIND_CONSTRUCTION_SITES, {
        filter: function(o) {
            //Only build rampart if this builder can maintain it to low bound
            return o.structureType==STRUCTURE_RAMPART 
              && energyAvailable >= RampartMaintainThreshold.Lowest/REPAIR_POWER;  //Currently 10K/100=100Energy
        }
    });
};

mod.getRampartsForMaintain = function(room) {
    return room.find(FIND_MY_STRUCTURES, {
        filter: function(o) {
            return o.structureType==STRUCTURE_RAMPART && o.hits<RampartMaintainThreshold.Low;
        }
    });
};

mod.canReleaseRampart = function(hits) {
    return hits>=RampartMaintainThreshold.Normal;
};

//Attention: Wall is not OwnedStructure
mod.getWallsForMaintain = function(room) {
    return room.find(FIND_STRUCTURES, {
        filter: function(o) {
            return o.structureType==STRUCTURE_WALL && o.hits<WallMaintainThreshold;
        }
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
    const hostiles = room.find(FIND_HOSTILE_CREEPS);
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
    const hostiles = room.find(FIND_HOSTILE_CREEPS);
    
    return _.sum(_.map(hostiles, o => self.sumThreatValueByBody(o.body))); //sumBy
};

mod.sortHostilesByPos = function(room, pos) {
    const self = this;
    const hostiles = room.find(FIND_HOSTILE_CREEPS);
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
//FIXME What if we can't even survive? Like low 3 level.
//TODO Calculate suitable body parts for spawner to spawn guardian
mod.shouldSpawnGuardian = function(room) {
    var towers = room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_TOWER) &&
                structure.energy > Config.EnergyForDefend;
        }
    });
    //var currentThreatValue = this.getCurrentThreatValue(room);
    //If there is no tower, just spawn one
    if(towers.length==0) return true;
    return false;
};

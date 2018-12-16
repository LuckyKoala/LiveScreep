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

mod.threatValue = {};

mod.loop = function(room) {
    if(room.controller && room.controller.my) {
        this.threatValue[room.name] = this.getCurrentThreatValue(room);
        if(this.threatValue[room.name] >= 5) {
            //We can not handle it without tower
            const time = Game.time;
            if(OK === room.controller.activateSafeMode()) Game.notify(`[${time}]Threat coming,activated safe mode!!!`);
            else Game.notify(`[${time}]Threat coming,can not activate safe mode!!!`);
        }
    }
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

//TODO Calculate suitable body parts for spawner to spawn guardian
mod.shouldSpawnGuardian = function(room) {
    var towers = room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_TOWER) &&
                structure.energy > Config.EnergyForDefend;
        }
    });
    //If there is a tower at least, then we can generate a guardian to help it
    if(towers.length>=1 && this.threatValue[room.name]>=0) return true;
    else return false;
};

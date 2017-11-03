//War logic goes there
var mod = {};
module.exports = mod;

const RampartMaintainThreshold = {
    Low: 100000, //100K
    Normal: 300000, //300K
};
const WallMaintainThreshold = 300000;
const ThreatValue = {
    attack: 4,
    ranged_attack: 3,
    heal: 2,
    tough: 1,
};

mod.loop = function(room) {
    //Do nothing
}

mod.getRampartsForMaintain = function(room) {
    return room.find(FIND_MY_STRUCTURES, {
        filter: function(o) {
            return o.structureType==STRUCTURE_RAMPART && o.hits<RampartMaintainThreshold.Low;
        }
    });
}

mod.canReleaseRampart = function(hits) {
    return hits>=RampartMaintainThreshold.Normal;
}

//Attention: Wall is not OwnedStructure
mod.getWallsForMaintain = function(room) {
    return room.find(FIND_STRUCTURES, {
        filter: function(o) {
            return o.structureType==STRUCTURE_WALL && o.hits<WallMaintainThreshold;
        }
    });
}

mod.canReleaseWall = function(hits) {
    return hits>=WallMaintainThreshold;
}

//TODO honour boost part
mod.getThreatValue = function(body) {
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
    
    return _.sum(_.map(hostiles, o => self.getThreatValue(o.body))); //sumBy
}

mod.getSortedHostiles = function(creep) {
    const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
    const self = this;
    const hostileMap = _.map(hostiles, function(o) {
        return {
            threat: self.getThreatValue(o.body),
            range: creep.pos.getRangeTo(o),
            id: o.id,
        }
    });
    return _.sortBy(hostileMap, ['threat', 'range', 'id']);
}
//TODO Calculate suitable body parts for spawner to spawn guardian
mod.shouldSpawnGuardian = function(room) {
    //TODO Count tower
    var towers = room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_TOWER) &&
                structure.energy > Util.War.EnergyForDefend;
        }
    });
    var currentThreatValue = this.getCurrentThreatValue(room);
    //Spawn only if tower have no energy and threat is not 0
    return towers.length == 0 && currentThreatValue > 0; 
}
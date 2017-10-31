//War logic goes there
var mod = {};
module.exports = mod;

const ThreatValue = {
    attack: 4,
    ranged_attack: 3,
    heal: 2,
    tough: 1,
}

mod.loop = function(room) {
    //Do nothing
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
    const outer = this;
    const hostiles = room.find(FIND_HOSTILE_CREEPS);
    return _.sumBy(hostiles, function(o) { return outer.getThreatValue(o.body); });
}

mod.getSortedHostiles = function(creep) {
    const hostiles = room.find(FIND_HOSTILE_CREEPS);
    const outer = this;
    const hostileMap = _.map(hostiles, function(o) {
        return {
            threat: outer.getThreatValue(o.body),
            range: creep.pos.getRangeTo(o),
            id: o.id,
        }
    });
    return _.sortBy(hostileMap, ['threat', 'range', 'id']);
}

mod.shouldSpawnGuardian = function(room) {
    //TODO Count tower
    var towers = room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_TOWER) &&
                structure.energy > 200;
        }
    });
    var currentThreatValue = this.getCurrentThreatValue(room);
    //Spawn only if tower have no energy and threat is not 0
    return towers.length < 0 && currentThreatValue > 0; 
}
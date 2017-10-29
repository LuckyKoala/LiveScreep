var utilWar = require('util.war');

let mod = new ActionObj('Guard');
module.exports = mod;

mod.nextTarget = function() {
    var creep = this.creep;
    const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
    const hostileMap = _.map(hostiles, function(o) {
        return {
            threat: utilWar.getThreatValue(o.body),
            range: creep.pos.getRangeTo(o),
            id: o.id,
        }
    });
    const sortHostiles = _.sortBy(hostileMap, ['threat', 'range', 'id']);
    if(sortHostiles.length) {
        return Game.getObjectById(_.last(sortHostiles).id);
    } else {
        return false;
    }
};

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        if(creep.attack(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    });
};
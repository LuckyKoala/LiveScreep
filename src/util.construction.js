//Construction logic goes there
var mod = {};
module.exports = mod;

mod.loop = function(room) {
    //Init memory
    if(_.isUndefined(Memory.construction)) Memory.construction = {};
    if(!_.isObject(Memory.construction)) Memory.construction = {};
    const entry = Memory.construction[room.name] || {};
    if(!entry['roadInit']) {
        //Build road
        this.initRoad(room);
        entry['roadInit'] = true;
    }
    //Store entry in memory
    Memory.construction[room.name] = entry;
}

//Build road
mod.initRoad = function(room) {
    const self = this;
    //Spawn to Source
    //Spawn to Controller
    const sources = room.find(FIND_SOURCES);
    const spawns = Util.Spawner.getSpawnsInRoom(room.name);
    _.forEach(spawns, spawn => {
        _.forEach(sources, source => self.buildRoad(room, spawn.pos, source.pos));
        self.buildRoad(room, spawn.pos, room.controller.pos);
    })
    //Spawn to Exit
    //const exitDir = creep.room.findExitTo(anotherCreep.room);
    //const exit = creep.pos.findClosestByRange(exitDir);
    //creep.moveTo(exit);
}

mod.showRoadPath = function(room, from, to) {
    const path = room.findPath(from, to);
    const points = _.map(path, o => [o.x, o.y]);
    new RoomVisual(room.name).poly(points, {
        fill: 'transparent',
        stroke: '#fff',
        lineStyle: 'dashed',
        strokeWidth: .15,
        opacity: .1
    });
}
mod.buildRoad = function(room, from, to) {
    const path = room.findPath(from, to);
    _.forEach(path, o => room.createConstructionSite(o.x, o.y, STRUCTURE_ROAD));
}

//Layout extension
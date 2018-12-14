//Construction logic goes there
var mod = {};
module.exports = mod;

//NOTE be careful to use findPath, it costs CPU
//TODO place tower site
mod.loop = function(room) {
    //Init memory
    if(_.isUndefined(Memory.construction)) Memory.construction = {};
    if(!_.isObject(Memory.construction)) Memory.construction = {};
    const entry = Memory.construction[room.name] || {};
    const sources = room.find(FIND_SOURCES);
    //== Road ==
    if(!entry['roadInit']) {
        this.initRoad(room, sources);
        entry['roadInit'] = true;
    }
    //== Container ==
    if(!entry['containerInit']) {
        this.initContainer(room, sources);
        entry['containerInit'] = true;
    }
    //== Extension ==
    //== Tower ==
    //Store entry in memory
    Memory.construction[room.name] = entry;
};

mod.initRoad = function(room, sources) {
    const self = this;
    const spawns = room.spawns;
    _.forEach(spawns, spawn => {
        //Spawn to Source
        _.forEach(sources, source => self.buildRoad(room, spawn.pos, source.pos));
        //Spawn to Controller
        self.buildRoad(room, spawn.pos, room.controller.pos);
    });
    //Spawn to Exit
    //const exitDir = creep.room.findExitTo(anotherCreep.room);
    //const exit = creep.pos.findClosestByRange(exitDir);
    //creep.moveTo(exit);
};

mod.initContainer = function(room, sources) {
    const terrain = new Room.Terrain(room.name);

    _.forEach(sources, source => {
        const y = source.pos.y;
        const x = source.pos.x;
        let swamps = [];
        for(let xi=x-1; xi<=x+1; xi++) {
            for(let yi=y-1; yi<=y+1; yi++) {
                //traverse fields nearby
                if(xi===x && yi===y) continue;
                if(0 === terrain.get(xi, yi)) {
                    //Plain Terrain is Best!
                    room.createConstructionSite(xi, yi, STRUCTURE_CONTAINER);
                    return;
                }
                if(TERRAIN_MASK_SWAMP === terrain.get(xi, yi)) {
                    //Store pos and continue finding
                    swamps.push({x: xi, y: yi});
                }
            }
        }
        if(swamps.length >= 1) {
            //So we must choose from swamps since there is no plain terrain as alternative
            room.createConstructionSite(swamps[0].x, swamps[0].y, STRUCTURE_CONTAINER);
        }
    });
};

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
};
mod.buildRoad = function(room, from, to) {
    const path = room.findPath(from, to);
    //Only build road between from and to, so we remove these two pos from path
    path.pop();
    path.shift();
    _.forEach(path, o => room.createConstructionSite(o.x, o.y, STRUCTURE_ROAD));
};

//Layout extension

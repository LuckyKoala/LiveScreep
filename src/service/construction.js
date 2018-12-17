//Construction logic goes there
var mod = {};
module.exports = mod;

function randomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

//TODO restore mechanism
//NOTE be careful to use findPath, it costs CPU
mod.loop = function(room) {
    const sites = _.filter(Game.constructionSites, function(site) {
        return site.room.name === room.name;
    });
    const noSite = sites.length === 0;
    //== Container ==
    //Firstly, we need a container for upgrader so it won't move
    //Order here matters since only one construction site at same pile is allowed
    if(noSite && !room.controller.container) {
        this.placeSitesNearby(room, room.controller, 2, STRUCTURE_CONTAINER);
        return;
    }
    //Then we need a container per source
    const sources = _.filter(room.find(FIND_SOURCES), function(source) {
        return source.container === false;
    });
    if(noSite && sources.length>0) {
        this.placeSitesNearby(room, sources[0], 1, STRUCTURE_CONTAINER);
        return;
    }
    //== Extension ==
    //Build extension if we can
    const extensionLimit = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][room.controller.level];
    var extensions = room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_EXTENSION;
        }
    });
    if(noSite && extensions.length<extensionLimit) {
        //Random selection
        const roomArea = CONTROLLER_STRUCTURES[STRUCTURE_ROAD][0];
        const width = Math.sqrt(roomArea);
        const x = randomInt(width);
        const y = randomInt(width);
        room.createConstructionSite(x, y, STRUCTURE_EXTENSION);
        return;
    }
    //== Tower ==
    //Tower is important too !
    const towerLimit = CONTROLLER_STRUCTURES[STRUCTURE_TOWER][room.controller.level];
    var towers = room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_TOWER;
        }
    });
    if(noSite && towers.length<towerLimit) {
        //We can build more tower!
        const spawns = _.filter(Game.spawns, function(spawn) {
            return spawn.room.name === room.name;
        });
        this.placeSitesNearby(room, spawns[0], 4, STRUCTURE_TOWER);
        return;
    }
    //== Road ==
    if(noSite) {
        //Init memory
        if(_.isUndefined(Memory.construction)) Memory.construction = {};
        if(!_.isObject(Memory.construction)) Memory.construction = {};
        const entry = Memory.construction[room.name] || {};
        if(!entry['roadInit']) {
            this.initRoad(room, sources);
            entry['roadInit'] = true;
        }
        //Store entry in memory
        Memory.construction[room.name] = entry;
    }
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

//0 match anything
//1 match walkable type
//2 match particular type
//TODO better look from selected center point
mod.placeSitesBlock = function(room, structureType) {
    const terrain = new Room.Terrain(room.name);
    //1. Declare a block which defines a pattern
    const extensionBlock = [
        [0,0,1,0,0],
        [0,1,2,1,0],
        [1,2,2,2,1],
        [0,1,2,1,0],
        [0,0,1,0,0],
    ];
    //2. separate room into according size of blocks
    //3. traverse these blocks and try to match the pattern
    //const look = room.lookAtArea(10,5,11,7);
    //4. place sites in position which is marked as '2'
};

mod.placeSiteAt = function(room, x, y, structureType) {
    const terrain = new Room.Terrain(room.name);
    if(0 === terrain.get(xi, yi)) {
        //Plain Terrain is Best!
        room.createConstructionSite(xi, yi, structureType);
        return true;
    } else {
        return false;
    }
};

//TODO Handle not available tile, e.g a structure is already there
mod.placeSitesNearby = function(room, obj, range, structureType) {
    const terrain = new Room.Terrain(room.name);
    const y = obj.pos.y;
    const x = obj.pos.x;
    let swamps = [];
    for(let xi=x-range; xi<=x+range; xi++) {
        for(let yi=y-range; yi<=y+range; yi++) {
            //traverse fields nearby
            if(xi===x && yi===y) continue;
            if(0 === terrain.get(xi, yi)) {
                //Plain Terrain is Best!
                room.createConstructionSite(xi, yi, structureType);
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
        room.createConstructionSite(swamps[0].x, swamps[0].y, structureType);
    }
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

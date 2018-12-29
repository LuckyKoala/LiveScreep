//Construction logic goes there
var mod = {};
module.exports = mod;

function randomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

mod.saveStructure = function(room, pos, type) {
    if(pos) {
        const entry = room.layout[type];
        if(entry) {
            entry.push(pos);
        }
    }
};

//** Dissi Flower **
// 60 extensions, 6 towers and 1 link
const dissiFlower = {
    vector: [
        [2,1,1,0,0,0,0,0,1,1,2],
        [1,0,1,1,0,0,0,1,1,0,1],
        [1,1,0,1,1,0,1,1,0,1,1],
        [0,1,1,0,1,0,1,0,1,1,0],
        [0,0,1,1,0,3,0,1,1,0,0],
        [0,0,0,1,2,0,2,1,0,0,0],
        [0,0,1,1,0,1,0,1,1,0,0],
        [0,1,1,0,1,1,1,0,1,1,0],
        [1,1,0,1,1,0,1,1,0,1,1],
        [1,0,1,1,0,0,0,1,1,0,1],
        [2,1,1,0,0,0,0,0,1,1,2]
    ],
    extension: 1,
    tower: 2,
    link: 3
};

mod.showRoomPlan = function(room) {
    for(const type in room.layout) {
        if(type === 'init') continue; //skip init flag
        const entry = room.layout[type];
        for(const pos of entry) {
            const x = pos[0];
            const y = pos[1];
            room.visual.structure(x, y, type);
        }
    }
};

function wrap2DArray(array) {
    return function(x, y) {
        return array[y][x];
    };
}

//Calculate a layout for the room and save to memory
//FIXME Structures may overlapped
mod.init = function(room) {
    delete room._layout; //re init
    delete room.memory.layout; //re init
    const terrain = room.getTerrain();
    //== Container ==
    //Firstly, we need a container for upgrader so it won't move
    this.saveStructure(room, posNearby(terrain, room.controller, 2), STRUCTURE_CONTAINER);
    //Then we need a container per source
    for(let source of room.sources) {
        this.saveStructure(room, posNearby(terrain, source, 1), STRUCTURE_CONTAINER);
    }
    //== Extension ==
    //Dissi flower here!
    const xlen = dissiFlower.vector[0].length;
    const ylen = dissiFlower.vector.length;
    const blockStartPos = Util.Helper.findBlockInRoom(room.name, xlen, ylen);
    if(blockStartPos) {
        //We can build dissi flower!
        const arrayWraper = wrap2DArray(dissiFlower.vector);
        for(let x=0; x<xlen; x++) {
            for(let y=0; y<ylen; y++) {
                const actualX = blockStartPos[0] + x;
                const actualY = blockStartPos[1] + y;
                switch(arrayWraper(x,y)) {
                case dissiFlower.extension:
                    this.saveStructure(room, [actualX,actualY], STRUCTURE_EXTENSION);
                    break;
                case dissiFlower.link:
                    this.saveStructure(room, [actualX,actualY], STRUCTURE_LINK);
                    break;
                case dissiFlower.tower:
                    this.saveStructure(room, [actualX,actualY], STRUCTURE_TOWER);
                    break;
                }
            }
        }
    } else {
        console.log('Failed to find start pos for dissi flower!');
        //TODO some fallback layout for extensions
    }
    //== Storage ==
    this.saveStructure(room, posNearby(terrain, room.spawns[0], 4), STRUCTURE_STORAGE);
    //== Road ==
    this.initRoad(room, room.sources);
    //== Link ==
    if(blockStartPos) {
        //We have dissi flower
        // so we don't need to place spawnLink
    } else {
        //A output link to match input link
        this.saveStructure(room, posNearby(terrain, room.spawns[0], 3), STRUCTURE_LINK);
    }
    //Source links first, it is input link
    for(let source of room.sources) {
        this.saveStructure(room, posNearby(terrain, source, 2), STRUCTURE_LINK);
    }
    //Controller link is also a output link
    this.saveStructure(room, posNearby(terrain, room.controller, 3), STRUCTURE_LINK);
    //TODO 2 links for remote mining or mineral mining
    //== Extractor ==
    const minerals = room.cachedFind(FIND_MINERALS);
    if(minerals.length>0) {
        const mineral = minerals[0];
        this.saveStructure(room, mineral.pos, STRUCTURE_EXTRACTOR);
    }
    //====== Wait to be implement ======
    //=== Defense ===
    //== Wall & Rampart ==
    //=== Technology ===
    //== Lab ==
    //== Extractor ==
    //== Spawn ==
    //=== Outside world ===
    //== Nuker ==
    //== PowerSpawn ==
    //== Observer ==
    //== Terminal ==

    //Set init flag
    room.layout.init = true;
};

mod.loop = function(room, forceRun=false) {
    //Do not init twice
    if(!room.layout.init) this.init(room);
    //Show room plan if ask
    const show = room.memory.showRoomPlan;
    if(show) this.showRoomPlan(room);
    //Do not loop room.layout every tick
    const lastConstruct = room.memory.lastConstruct || 0;
    if(!forceRun && (Game.time-lastConstruct) < 40) return;

    //one site at one time
    const sites = room.cachedFind(FIND_CONSTRUCTION_SITES);
    const noSite = sites.length === 0;
    if(!noSite) {
        // actually not loop room.layout
        //  so we don not update lastConstruct here
        return;
    }

    console.log(`Loop construction of room ${room.name}`);
    room.memory.lastConstruct = Game.time;

    //== Common iterate function ==
    let success = false;
    const iterateAndPlace = function(type) {
        for(const pos of room.layout[type]) {
            //Iterate
            const x = pos[0];
            const y = pos[1];
            const arr = room.lookForAt(LOOK_STRUCTURES, x, y);
            if(arr.length > 0) {
                //There is a structure on the pos
                // TODO check if type is equal and do properly rebuild
                continue;
            } else {
                room.createConstructionSite(x, y, type);
                return true;
            }
        }
        return false;
    };

    //=== Container ===
    success = iterateAndPlace(STRUCTURE_CONTAINER);
    if(success) return;
    //=== Extension ===
    //Build extension if we can
    const extensionLimit = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][room.controller.level];
    var extensions = room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_EXTENSION;
        }
    });
    if(extensions.length<extensionLimit) {
        success = iterateAndPlace(STRUCTURE_EXTENSION);
    }
    if(success) return;
    //== Tower ==
    //Build tower if we can
    const towerLimit = CONTROLLER_STRUCTURES[STRUCTURE_TOWER][room.controller.level];
    var towers = room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_TOWER;
        }
    });
    if(towers.length<towerLimit) {
        success = iterateAndPlace(STRUCTURE_TOWER);
    }
    if(success) return;
    //== Storage ==
    if(!room.storage) {
        success = iterateAndPlace(STRUCTURE_STORAGE);
    }
    if(success) return;
    //== Link ==
    const linkLimit = CONTROLLER_STRUCTURES[STRUCTURE_LINK][room.controller.level];
    const links = room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_LINK;
        }
    });
    if(links.length<linkLimit) {
        success = iterateAndPlace(STRUCTURE_LINK);
    }
    if(success) return;
    //== Extractor ==
    const extractorLimit = CONTROLLER_STRUCTURES[STRUCTURE_EXTRACTOR][room.controller.level];
    const extractors = room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_EXTRACTOR;
        }
    });
    if(extractors.length<extractorLimit) {
        success = iterateAndPlace(STRUCTURE_EXTRACTOR);
    }
    if(success) return;
    //== Road ==
    iterateAndPlace(STRUCTURE_ROAD);
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

function posNearby(terrain, obj, range) {
    const y = obj.pos.y;
    const x = obj.pos.x;
    let swamps = [];
    for(let xi=x-range; xi<=x+range; xi++) {
        for(let yi=y-range; yi<=y+range; yi++) {
            //traverse fields nearby
            if(xi===x && yi===y) continue;
            if(0 === terrain.get(xi, yi)) {
                //Plain Terrain is Best!
                return [xi, yi];
            }
            if(TERRAIN_MASK_SWAMP === terrain.get(xi, yi)) {
                //Store pos and continue finding
                swamps.push({x: xi, y: yi});
            }
        }
    }
    if(swamps.length >= 1) {
        //So we must choose from swamps since there is no plain terrain as alternative
        return [swamps[0].x, swamps[0].y];
    }
    return false;
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
    const self = this;
    _.forEach(path, o => self.saveStructure(room, [o.x, o.y], STRUCTURE_ROAD));
};

//Layout extension

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
        [1,4,1,1,0,0,0,1,1,4,1],
        [1,1,4,1,1,0,1,1,4,1,1],
        [0,1,1,4,1,0,1,4,1,1,0],
        [0,0,1,1,4,3,4,1,1,0,0],
        [0,0,0,1,2,4,2,1,0,0,0],
        [0,0,1,1,4,1,4,1,1,0,0],
        [0,1,1,4,1,1,1,4,1,1,0],
        [1,1,4,1,1,0,1,1,4,1,1],
        [1,4,1,1,0,0,0,1,1,4,1],
        [2,1,1,0,0,0,0,0,1,1,2]
    ],
    extension: 1,
    tower: 2,
    link: 3,
    road: 4
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
                case dissiFlower.road:
                    this.saveStructure(room, [actualX,actualY], STRUCTURE_ROAD);
                    break;
                }
            }
        }
    } else {
        Logger.warning('Failed to find start pos for dissi flower!');
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
        this.saveStructure(room, posNearby(terrain, mineral, 1), STRUCTURE_CONTAINER);
    }

    //=== Defense ===
    //== Wall & Rampart ==
    //layout: 1 for wall,0 for rampart
    //--0111110--
    const wallLayout = [STRUCTURE_RAMPART, STRUCTURE_WALL, STRUCTURE_WALL, STRUCTURE_WALL, STRUCTURE_WALL, STRUCTURE_WALL, STRUCTURE_RAMPART];
    const getWallType = (index) => wallLayout[index%wallLayout.length];
    //Find all available exit directions
    const exitStrs = Game.map.describeExits(room.name);
    for(let exitStr in exitStrs) {
        const exitDir = parseInt(exitStr);
        //Firstly, we add offset to x/y coordinate since we can not place structure above exit tile
        let xoffset = 0;
        let yoffset = 0;
        let xLeftOffset = 0;
        let yLeftOffset = 0;
        switch(exitDir) {
        case FIND_EXIT_TOP:
            //y=0
            yoffset = 1;
            xLeftOffset = -1;
            break;
        case FIND_EXIT_BOTTOM:
            //y=49
            yoffset = -1;
            xLeftOffset = -1;
            break;
        case FIND_EXIT_LEFT:
            //x=0
            xoffset = 1;
            yLeftOffset = -1;
            break;
        case FIND_EXIT_RIGHT:
            //x=49
            xoffset = -1;
            yLeftOffset = -1;
            break;
        default:
            Logger.warning(`Unrecognized exit direction: ${exitDir} while initiating layout of room ${room.name}`);
        }
        //- for exit tile,  / for natural wall, 0 for plain/swamp terrain, 1 for planned wall
        // Before plan:
        //  0000/0000000////
        //  00//00//00000000
        //  ///------///--//
        // After plan:
        //  0000/0000000////
        //  00//11//11011000
        //  ///------///--//
        //Now we find all exit tile on target direction and do some computation on them
        const exits = room.cachedFind(exitDir);
        const wallPosArray = [];
        for(const exit of exits) {
            //Extract and add offset to x and y coordinate
            const x = exit.x+xoffset;
            const y = exit.y+yoffset;

            //No natural wall below planned wall
            if(validatePos(x, y) && terrain.get(x, y)!==TERRAIN_MASK_WALL) {
                const addWall = (x, y) => {
                    // Before
                    //  00///0//
                    //  000/0000
                    //  //---///
                    // After
                    //  00///0//
                    //  011/1100
                    //  //---///
                    //add wall only if up and up-left and up-right is not natural wall
                    const aboveX = x+xoffset;
                    const aboveY = y+yoffset;
                    const aboveLeftX = aboveX+xLeftOffset;
                    const aboveLeftY = aboveY+yLeftOffset;
                    const aboveRightX = aboveX-xLeftOffset;
                    const aboveRightY = aboveY-yLeftOffset;
                    const isNaturalWall = (x, y) =>  {
                        if(validatePos(x,y)) {
                            return terrain.get(x,y)===TERRAIN_MASK_WALL;
                        } else {
                            return true;
                        }
                    };
                    if(isNaturalWall(aboveX,aboveY) && isNaturalWall(aboveLeftX,aboveLeftY) && isNaturalWall(aboveRightX,aboveRightY)) {
                        //No need to add this wall, this pos is surround by natural walls
                    } else {
                        wallPosArray.push([x,y]);
                    }
                };
                addWall(x, y);
                //if left or right is a natural wall, add a new pos
                const addCoverWall = (x, y) => {
                    if(validatePos(x, y) && terrain.get(x, y)===TERRAIN_MASK_WALL
                       && terrain.get(x+xoffset, y+yoffset)!==TERRAIN_MASK_WALL) {
                        addWall(x+xoffset, y+yoffset);
                    }
                };
                const leftX = exit.x+xLeftOffset;
                const leftY = exit.y+yLeftOffset;
                const rightX = exit.x-xLeftOffset;
                const rightY = exit.y-yLeftOffset;
                addCoverWall(leftX, leftY);
                addCoverWall(rightX, rightY);
            }

        }
        for(const i in wallPosArray) {
            this.saveStructure(room, wallPosArray[i], getWallType(i));
        }
    }

    //====== Wait to be implement ======
    //=== Technology ===
    //== Lab ==
    //== Spawn ==
    //=== Outside world ===
    //== Nuker ==
    //== PowerSpawn ==
    //== Observer ==
    //== Terminal ==

    //Set init flag
    room.layout.init = true;
};

const makeIterateAndPlace = function(room) {
    return (type) => {
        for(const pos of room.layout[type]) {
            //Iterate
            const x = pos[0];
            const y = pos[1];
            const arr = _.filter(room.lookForAt(LOOK_STRUCTURES, x, y), o => o.structureType===type);
            if(arr.length > 0) {
                //There is a same type of structure on the pos
                // so we can't build on this pos
                //TODO check integrity, maybe rebuild structure on this pos
                continue;
            } else {
                if(room.createConstructionSite(x, y, type) === OK) {
                    return true;
                }
            }
        }
        return false;
    };
};

mod.loop = function(room, forceRun=false) {
    //Do not init twice
    if(!room.layout.init) this.init(room);
    //Show room plan if ask
    const show = room.memory.showRoomPlan;
    if(show) this.showRoomPlan(room);
    //Do not loop room.layout every tick
    const lastConstruct = room.memory.lastConstruct || 0;
    const lastFullyConstructionCheck = room.memory.lastFullyConstructionCheck || 0;

    //one site at one time
    const sites = room.cachedFind(FIND_CONSTRUCTION_SITES);
    const noSite = sites.length < 2;
    if(!noSite || (Game.time-lastFullyConstructionCheck)<100) {
        // actually not loop room.layout
        //  so we don not update lastConstruct here
        return;
    }

    Logger.trace(`Loop construction of room ${room.name}`);
    room.memory.lastConstruct = Game.time;

    //== Common iterate function ==
    let success = false;
    const iterateAndPlace = makeIterateAndPlace(room);

    //=== Container ===
    if(!room.controller.container) {
        success = iterateAndPlace(STRUCTURE_CONTAINER);
        if(success) return;
    }
    //Only build source container at RCL 3
    if(room.controller.level >= 3) {
        for(let source of room.sources) {
            if(!source.container) {
                success = iterateAndPlace(STRUCTURE_CONTAINER);
                if(success) return;
            }
        }
    }
    //Only build mineral container at RCL 6
    if(room.controller.level >= 6) {
        if(!room.mineral.container) {
            success = iterateAndPlace(STRUCTURE_CONTAINER);
            if(success) return;
        }
    }
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
        const storageAvailable = CONTROLLER_STRUCTURES[STRUCTURE_STORAGE][room.controller.level];
        if(storageAvailable>=1) {
            success = iterateAndPlace(STRUCTURE_STORAGE);
        }
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
    success = iterateAndPlace(STRUCTURE_ROAD);
    if(success) return;
    //== Wall ==
    success = iterateAndPlace(STRUCTURE_WALL);
    if(success) return;
    //== Rampart ==
    success = iterateAndPlace(STRUCTURE_RAMPART);
    if(success) return;

    room.memory.lastFullyConstructionCheck = Game.time;
};

//====================== Remote Mining ==============================
mod.initRemoteMining = function(flag, room) {
    delete room._layout; //re init
    delete room.memory.layout; //re init
    //== Road ==
    this.initRemoteMiningRoad(flag, room, room.sources);
    room.layout.init = true;
};

mod.loopRemoteMining = function(flag) {
    const room = flag.room;
    const assignedRoom = flag.memory.assignedRoom;
    //Only loop with vision of the room
    if(!room || !assignedRoom) return;

    //Do not init twice
    if(!room.layout.init) this.initRemoteMining(flag, room);
    //Show room plan if ask
    const show = room.memory.showRoomPlan;
    if(show) this.showRoomPlan(room);
    //Do not loop room.layout every tick
    const lastConstruct = room.memory.lastConstruct || 0;
    const lastFullyConstructionCheck = room.memory.lastFullyConstructionCheck || 0;

    //one site at one time
    const sites = room.cachedFind(FIND_CONSTRUCTION_SITES);
    const noSite = sites.length < 2;
    if(!noSite || (Game.time-lastFullyConstructionCheck)<100) {
        // actually not loop room.layout
        //  so we don not update lastConstruct here
        return;
    }

    Logger.trace(`Loop remote mining construction of room ${room.name}`);
    room.memory.lastConstruct = Game.time;

    const iterateAndPlace = makeIterateAndPlace(room);

    //== Road ==
    const success = iterateAndPlace(STRUCTURE_ROAD);
    if(!success) {
        room.memory.lastFullyConstructionCheck = Game.time;
    }
};

mod.initRemoteMiningRoad = function(flag, room, sources) {
    const self = this;
    const exitDir = room.findExitTo(Game.rooms[flag.memory.assignedRoom]);
    _.forEach(sources, source => {
        const exit = source.pos.findClosestByRange(exitDir);
        self.buildRoad(room, exit, source.pos);
    });
};
//===================================================================

mod.initRoad = function(room, sources) {
    const self = this;
    const exits = Game.map.describeExits(room.name);
    const spawns = room.spawns;
    _.forEach(spawns, spawn => {
        //Spawn to Source
        _.forEach(sources, source => self.buildRoad(room, spawn.pos, source.pos));
        //Spawn to Controller
        self.buildRoad(room, spawn.pos, room.controller.pos);
        //Spawn to Exit
        for(let exitStr in exits) {
            const exitDir = parseInt(exitStr);
            const exit = spawn.pos.findClosestByPath(exitDir);
            self.buildRoad(room, spawn.pos, exit);
        }
    });
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

function validatePos(x,y) {
    return x>=0 && x<=50 && y>=0 && y<=50;
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
    const path = room.findPath(from, to, {
        ignoreCreeps: true,
        range: 1
    });
    const self = this;
    _.forEach(path, o => self.saveStructure(room, [o.x, o.y], STRUCTURE_ROAD));
};

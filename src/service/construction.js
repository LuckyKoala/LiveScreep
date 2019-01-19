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

const bunker = {
    vector: [
        [0,4,4,1,1,4,4,4,1,4,4,4,0],
        [4,7,1,1,4,1,1,1,4,1,1,7,4],
        [4,1,1,4,1,4,1,4,1,4,1,1,4],
        [4,1,4,1,1,1,4,1,1,1,4,1,1],
        [1,4,1,1,3,4,5,4,3,1,1,4,1],
        [1,1,4,1,4,0,3,0,4,1,4,1,4],
        [4,1,1,4,5,3,6,4,7,4,1,1,4],
        [4,1,4,1,4,0,3,0,4,11,4,0,4],
        [1,4,1,1,3,4,5,4,8,9,9,4,0],
        [4,1,4,1,1,1,4,12,9,9,4,9,4],
        [4,1,1,4,1,4,1,4,9,4,9,9,4],
        [4,10,1,1,4,1,1,0,4,9,9,7,4],
        [0,4,4,4,1,1,4,4,0,4,4,4,0]
    ],
    typeMap: [false,
              STRUCTURE_EXTENSION,
              STRUCTURE_CONTAINER,
              STRUCTURE_TOWER,
              STRUCTURE_ROAD,
              STRUCTURE_SPAWN,
              STRUCTURE_STORAGE,
              STRUCTURE_LINK,
              STRUCTURE_TERMINAL,
              STRUCTURE_LAB,
              STRUCTURE_OBSERVER,
              STRUCTURE_POWER_SPAWN,
              STRUCTURE_NUKER]
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

mod.init = function(room) {
    delete room._layout; //re init
    delete room.memory.layout; //re init
    const terrain = room.getTerrain();
    //== Controller container ==
    //Firstly, we need a container for upgrader so it won't move
    this.saveStructure(room, posNearby(terrain, room.controller, 1), STRUCTURE_CONTAINER);
    //Then we need a container per source
    for(let source of room.sources) {
        this.saveStructure(room, posNearby(terrain, source, 1), STRUCTURE_CONTAINER);
    }
    //== Bunker ==
    const anchorFlags = _.filter(room.cachedFind(FIND_FLAGS), f => FlagUtil.bunkerAnchor.examine(f));
    if(anchorFlags.length !== 1) {
        Logger.warning(`[${room.name}] Can't find exactly one anchorFlag[${FlagUtil.bunkerAnchor.describe()}], please check`);
        return;
    }
    const anchorFlag = anchorFlags[0];
    const rotation = anchorFlag.memory.rotation || 0;
    const xlen = bunker.vector[0].length;
    const ylen = bunker.vector.length;
    //We can build dissi flower!
    const arrayWraper = wrap2DArray(bunker.vector);
    const posMapper = (function(rotationAngle) {
        const initialX = anchorFlag.pos.x;
        const initialY = anchorFlag.pos.y;
        switch(rotationAngle) {
        case 0:
            return (x, y) => [initialX+x, initialY+y];
        case 1:
            return (x, y) => [initialX-y, initialY+x];
        case 2:
            return (x, y) => [initialX-x, initialY-y];
        case 3:
            return (x, y) => [initialX+y, initialY-x];
        default:
            Logger.warning('rotationAngle shoule be one of [0,1,2,3] ! using fallback 0 angle mapper...');
            return (x, y) => [initialX+x, initialY+y];
        }
    })(rotation);

    for(let x=0; x<xlen; x++) {
        for(let y=0; y<ylen; y++) {
            const structureTypeVal = arrayWraper(x,y);
            const structureType = bunker.typeMap[structureTypeVal];
            if(structureType) this.saveStructure(room, posMapper(x, y), structureType);
        }
    }
    //== Road ==
    this.initRoad(room, room.sources);

    //Source links first, it is input link
    for(let source of room.sources) {
        this.saveStructure(room, posNearby(terrain, source, 2), STRUCTURE_LINK);
    }
    //== Extractor ==
    const minerals = room.cachedFind(FIND_MINERALS);
    if(minerals.length>0) {
        const mineral = minerals[0];
        this.saveStructure(room, mineral.pos, STRUCTURE_EXTRACTOR);
        this.saveStructure(room, posNearby(terrain, mineral, 1), STRUCTURE_CONTAINER);
    }

    //Set init flag
    room.layout.init = true;
};

//== Common iterate function ==
const makeIterateAndPlace = function(room) {
    return (type) => {
        return () => {
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
                    const result = room.createConstructionSite(x, y, type);
                    if(result === OK) {
                        return true;
                    }
                }
            }
            return false;
        };
    };
};
const ChainHelper = function(room) {
    this.functions = [];
    this.add = function(func) {
        this.functions.push(func);
    };
    this.run = function(func) {
        for(const f of this.functions) {
            if(f()) break;
        }
    };
};
//==============================

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

    const iterateAndPlace = makeIterateAndPlace(room);
    const chain = new ChainHelper(room);
    const addToChainIfPossible = function(structureType, predicate=false) {
        if(predicate) {
            if(predicate()) chain.add(iterateAndPlace(structureType));
            return;
        }

        const limit = CONTROLLER_STRUCTURES[structureType][room.controller.level];
        if(limit > 0) {
            const objs = _.filter(room.cachedFind(FIND_MY_STRUCTURES), (structure) => {
                return structure.structureType == structureType;
            });
            if(objs.length < limit) chain.add(iterateAndPlace(structureType));
        }
    };

    //======== Low level structures 1-4 =======
    addToChainIfPossible(STRUCTURE_CONTAINER);
    addToChainIfPossible(STRUCTURE_EXTENSION);
    addToChainIfPossible(STRUCTURE_TOWER);
    addToChainIfPossible(STRUCTURE_ROAD);
    addToChainIfPossible(STRUCTURE_STORAGE, () => room.storage===undefined);

    //======== High level structures 5-8 ========
    addToChainIfPossible(STRUCTURE_EXTRACTOR);
    addToChainIfPossible(STRUCTURE_SPAWN, () => {
        const spawnLimit = CONTROLLER_STRUCTURES[STRUCTURE_SPAWN][room.controller.level];
        return spawnLimit > 0 && room.spawns.length < spawnLimit;
    });
    addToChainIfPossible(STRUCTURE_STORAGE, () => room.terminal===undefined);
    addToChainIfPossible(STRUCTURE_LINK);
    addToChainIfPossible(STRUCTURE_LAB);
    addToChainIfPossible(STRUCTURE_OBSERVER);
    addToChainIfPossible(STRUCTURE_POWER_SPAWN);
    addToChainIfPossible(STRUCTURE_NUKER);
    chain.add(() => room.memory.lastFullyConstructionCheck = Game.time);

    //======== Actually run chain functions ========
    chain.run();
};

//====================== Remote Mining ==============================
mod.initRemoteMining = function(flag, room) {
    delete room._layout; //re init
    delete room.memory.layout; //re init
    //== Road ==
    this.initRemoteMiningRoad(flag, room, room.sources);
    room.layout.init = true;
    //== Container ==
    const terrain = new Room.Terrain(room.name);
    for(let source of room.sources) {
        this.saveStructure(room, posNearby(terrain, source, 1), STRUCTURE_CONTAINER);
    }
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
    const chain = new ChainHelper(room);

    chain.add(iterateAndPlace(STRUCTURE_ROAD));
    chain.add(iterateAndPlace(STRUCTURE_CONTAINER));
    chain.add(() => room.memory.lastFullyConstructionCheck = Game.time);
    chain.run();
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

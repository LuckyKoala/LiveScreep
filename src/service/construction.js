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

mod.unsaveStructure = function(room, pos, type) {
    if(pos) {
        const entry = room.layout[type];
        if(entry) {
            _.remove(entry, ele => ele[0]===pos[0] && ele[1]===pos[1]);
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
        [4,0,1,1,4,1,1,1,4,1,1,0,4],
        [4,1,1,4,1,4,1,4,1,4,1,1,4],
        [4,1,4,1,1,1,4,1,1,1,4,1,1],
        [1,4,1,1,3,4,5,4,3,1,1,4,1],
        [1,1,4,1,4,0,3,0,4,1,4,1,4],
        [4,1,1,4,5,3,6,4,7,4,1,1,4],
        [4,1,4,1,4,0,3,0,4,11,4,0,4],
        [1,4,1,1,3,4,5,4,8,9,9,4,0],
        [4,1,4,1,1,1,4,12,9,9,4,9,4],
        [4,1,1,4,1,4,1,4,9,4,9,9,4],
        [4,10,1,1,4,1,1,0,4,9,9,0,4],
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
    const posControllerContainer = posNearby(terrain, room.controller, 1);
    this.saveStructure(room, posControllerContainer, STRUCTURE_CONTAINER);
    this.saveStructure(room, posControllerContainer, STRUCTURE_RAMPART);
    //Then we need a container per source
    for(let source of room.sources) {
        const posContainer = posNearby(terrain, source, 1);
        this.saveStructure(room, posContainer, STRUCTURE_CONTAINER);
        this.saveStructure(room, posContainer, STRUCTURE_RAMPART);
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

    anchorFlag.memory.diagonal = posMapper(xlen-1, ylen-1);

    for(let x=0; x<xlen; x++) {
        for(let y=0; y<ylen; y++) {
            const structureTypeVal = arrayWraper(x,y);
            const structureType = bunker.typeMap[structureTypeVal];
            const realPos = posMapper(x, y);
            if(terrain.get(realPos[0], realPos[1])===TERRAIN_MASK_WALL && structureType!==STRUCTURE_ROAD) {
                Logger.warning(`[${room.name}] There is a natural wall at [${realPos[0]}, ${realPos[1]}] where is meant to be ${structureType}`);
            } else {
                if(structureType) {
                    this.saveStructure(room, realPos, structureType);
                }
                this.saveStructure(room, realPos, STRUCTURE_RAMPART);
            }
        }
    }

    //Source links first, it is input link
    for(let source of room.sources) {
        const pos = posNearby(terrain, source, 2);
        this.saveStructure(room, pos, STRUCTURE_LINK);
        this.saveStructure(room, pos, STRUCTURE_RAMPART);
    }
    //Controller link
    const posControllerLink = posNearby(terrain, room.controller, 2);
    this.saveStructure(room, posControllerLink, STRUCTURE_LINK);
    this.saveStructure(room, posControllerLink, STRUCTURE_RAMPART);

    //== Road and link near exit ==
    this.initRoad(room, room.sources);

    //== Extractor ==
    const minerals = room.cachedFind(FIND_MINERALS);
    if(minerals.length>0) {
        const mineral = minerals[0];
        this.saveStructure(room, mineral.pos, STRUCTURE_EXTRACTOR);
        const posMineralContainer = posNearby(terrain, mineral, 1);
        this.saveStructure(room, posMineralContainer, STRUCTURE_CONTAINER);
        this.saveStructure(room, posMineralContainer, STRUCTURE_RAMPART);
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
                const arr = room.lookForAt(LOOK_STRUCTURES, x, y);
                let rebuildStatus = false;
                const canBuild = (function () {
                    for(const structure of arr) {
                        const structureType = structure.structureType;
                        if(structureType === type) return false; //already in place
                        if(type===STRUCTURE_RAMPART) break;
                        if(structureType===STRUCTURE_RAMPART || (structureType===STRUCTURE_ROAD && type===STRUCTURE_CONTAINER)) continue; //any structure other than themselves can place above
                        //Then we may need to destroy and rebuild
                        if(!Config.RebuildStructures) continue;

                        //Starting rebuild procedure
                        //FIXME maybe rebuild a structure at untouchable place
                        if(structure.my!==undefined && !structure.my) {
                            //Someone else owned it, place a dismantle flag
                            room.createFlag(x, y, `dismantle_${room.name}_{x}_{y}`, FlagUtil.dismantle.color, FlagUtil.dismantle.secondaryColor);
                            Logger.info(`[${room.name}] Dismantle other's ${type} scheduled at [${x}, ${y}]`);
                            return false;
                        }

                        if(structureType===STRUCTURE_SPAWN) {
                            //Do we have more than one spawn?
                            //TODO rebuild initial spawn even there is no other spawn
                            if(room.spawns.length > 1) {
                                const spawn = structure;
                                if(!spawn.spawning && spawn.destroy()===OK) {
                                    rebuildStatus = true;
                                }
                                return false;
                            }
                        }

                        if(structureType===STRUCTURE_STORAGE) return false;
                        if(structureType===STRUCTURE_TERMINAL && (!room.storage || room.terminal.cooldown>0)) return false; //no to destroy these precious building

                        if(structure.destroy()===OK) {
                            //Current structure is conflict with scheduled structure,
                            //  let's remove it from plan so AI won't trapped in dead loop.
                            if(structureType===STRUCTURE_ROAD) mod.unsaveStructure(room, pos, STRUCTURE_ROAD);

                            rebuildStatus = true;
                        }
                        return false;
                    }
                    return true;
                })();

                //So this is normal case
                if(rebuildStatus) return true; //block iterateAndPlace request after so AI can select same target in next tick.
                if(!canBuild) continue;
                const result = room.createConstructionSite(x, y, type);
                if(result === OK) {
                    return true;
                } else if(result === ERR_RCL_NOT_ENOUGH) {
                    //We may have some structures outside bunker
                    if(Config.RebuildStructures) {
                        const anchorFlags = _.filter(room.cachedFind(FIND_FLAGS), f => FlagUtil.bunkerAnchor.examine(f));
                        if(anchorFlags.length !== 1) return false;
                        const anchorFlag = anchorFlags[0];
                        const inAABB = (function(xmin, xmax, ymin, ymax) {
                            return (c) => (xmin <= c.pos.x && c.pos.x <= xmax) &&
                                (ymin <= c.pos.y && c.pos.y <= ymax);
                        })(Math.min(anchorFlag.pos.x, anchorFlag.memory.diagonal[0]),
                           Math.max(anchorFlag.pos.x, anchorFlag.memory.diagonal[0]),
                           Math.min(anchorFlag.pos.y, anchorFlag.memory.diagonal[1]),
                           Math.max(anchorFlag.pos.y, anchorFlag.memory.diagonal[1]));

                        const fakeRoomObject = {pos: {
                            x: x,
                            y: y
                        }};
                        if(!inAABB(fakeRoomObject)) {
                            //Only rebuild structures inside bunker
                            continue;
                        }

                        if(type===STRUCTURE_SPAWN && room.spawns.length <= 1) continue;

                        if(type===STRUCTURE_STORAGE) continue;
                        if(type===STRUCTURE_TERMINAL && (!room.storage || room.terminal.cooldown>0)) continue; //no to destroy these precious building

                        const structuresOutsideBunker = room.cachedFind(FIND_MY_STRUCTURES).filter(s => s.structureType===type && !inAABB(s));
                        if(structuresOutsideBunker.length > 0) {
                            const structure = structuresOutsideBunker[0];
                            const structurePos = structure.pos;
                            if(structure.destroy()===OK) {
                                mod.unsaveStructure(room, structurePos, type);
                            }
                            return true; //block iterateAndPlace request after so AI can select same target in next tick.
                        }
                    }
                }
            }
            return false;
        };
    };
};
const ChainHelper = function() {
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
    const sites = _.filter(room.cachedFind(FIND_CONSTRUCTION_SITES), c => c.my);
    const noSite = sites.length === 0;
    if(!noSite || (Game.time-lastFullyConstructionCheck)<100) {
        // actually not loop room.layout
        //  so we don not update lastConstruct here
        return;
    }

    Logger.trace(`Loop construction of room ${room.name}`);
    room.memory.lastConstruct = Game.time;

    const iterateAndPlace = makeIterateAndPlace(room);
    const chain = new ChainHelper();
    const addToChainIfPossible = function(structureType, predicate=false) {
        if(Config.RebuildStructures) {
            chain.add(iterateAndPlace(structureType));
            return;
        }
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

    //Make sure there is a path inside bunker
    addToChainIfPossible(STRUCTURE_ROAD);
    //Spawns and extensions is vital for spawning
    addToChainIfPossible(STRUCTURE_SPAWN, () => {
        const spawnLimit = CONTROLLER_STRUCTURES[STRUCTURE_SPAWN][room.controller.level];
        return spawnLimit > 0 && room.spawns.length < spawnLimit;
    });
    addToChainIfPossible(STRUCTURE_EXTENSION);
    //Defense unit!
    addToChainIfPossible(STRUCTURE_TOWER);
    //Storage and terminal
    addToChainIfPossible(STRUCTURE_STORAGE, () => room.storage===undefined);
    addToChainIfPossible(STRUCTURE_TERMINAL, () => room.terminal===undefined);
    //Buffer and link
    addToChainIfPossible(STRUCTURE_LINK);
    addToChainIfPossible(STRUCTURE_CONTAINER);

    addToChainIfPossible(STRUCTURE_EXTRACTOR);
    addToChainIfPossible(STRUCTURE_OBSERVER);

    if(room.storage && room.storage.store[RESOURCE_ENERGY]>Config.StorageBoundForPlaceHighLevelStructures) {
        addToChainIfPossible(STRUCTURE_LAB);
        addToChainIfPossible(STRUCTURE_NUKER);
        addToChainIfPossible(STRUCTURE_RAMPART);
        addToChainIfPossible(STRUCTURE_POWER_SPAWN);
    }
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
    const sites = _.filter(room.cachedFind(FIND_CONSTRUCTION_SITES), c => c.my);
    const noSite = sites.length < 2;
    if(!noSite || (Game.time-lastFullyConstructionCheck)<100) {
        // actually not loop room.layout
        //  so we don not update lastConstruct here
        return;
    }

    Logger.trace(`Loop remote mining construction of room ${room.name}`);
    room.memory.lastConstruct = Game.time;

    const iterateAndPlace = makeIterateAndPlace(room);
    const chain = new ChainHelper();

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
    const terrain = new Room.Terrain(room.name);
    let linkRemain = 2;
    if(spawns.length > 0) {
        const spawn = spawns[0];
        //Spawn to Source
        _.forEach(sources, source => self.buildRoad(room, spawn.pos, source.pos));
        //Spawn to Controller
        self.buildRoad(room, spawn.pos, room.controller.pos);
        //Spawn to Exit
        for(let exitStr in exits) {
            const exitDir = parseInt(exitStr);
            const exit = spawn.pos.findClosestByPath(exitDir);
            if(linkRemain > 0) {
                const pos = posNearby(terrain, {pos: exit}, 6, true);
                self.saveStructure(room, pos, STRUCTURE_LINK);
                if(pos) linkRemain--;
            }
            self.buildRoad(room, spawn.pos, exit);
        }
    }
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

function posNearby(terrain, obj, range, ensureRange=false) {
    const y = obj.pos.y;
    const x = obj.pos.x;
    let swamps = [];
    for(let xi=x-range; xi<=x+range; xi++) {
        for(let yi=y-range; yi<=y+range; yi++) {
            //traverse fields nearby
            if(xi===x && yi===y) continue;
            if(!validatePos(xi, yi)) continue;
            if(ensureRange && Math.max(Math.abs(xi-x), Math.abs(yi-y)) !== range) continue;
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
    return x>=0 && x<=49 && y>=0 && y<=49;
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

//======Define Memory Property======
Object.defineProperty(Structure.prototype, 'memory', {
    configurable: true,
    get: function() {
        if(_.isUndefined(Memory.structures)) {
            Memory.structures = {};
        }
        if(!_.isObject(Memory.structures)) {
            return undefined;
        }
        return Memory.structures[this.id] = Memory.structures[this.id] || {};
    },
    set: function(value) {
        if(_.isUndefined(Memory.structures)) {
            Memory.structures = {};
        }
        if(!_.isObject(Memory.structures)) {
            throw new Error('Could not set memory extension for structures');
        }
        Memory.structures[this.id] = value;
    }
});

Object.defineProperty(Source.prototype, 'memory', {
    configurable: true,
    get: function() {
        if(_.isUndefined(Memory.sources)) {
            Memory.sources = {};
        }
        if(!_.isObject(Memory.sources)) {
            return undefined;
        }
        return Memory.sources[this.id] = Memory.sources[this.id] || {};
    },
    set: function(value) {
        if(_.isUndefined(Memory.sources)) {
            Memory.sources = {};
        }
        if(!_.isObject(Memory.sources)) {
            throw new Error('Could not set memory extension for sources');
        }
        Memory.sources[this.id] = value;
    }
});

Object.defineProperty(Mineral.prototype, 'memory', {
    configurable: true,
    get: function() {
        if(_.isUndefined(Memory.minerals)) {
            Memory.minerals = {};
        }
        if(!_.isObject(Memory.minerals)) {
            return undefined;
        }
        return Memory.minerals[this.id] = Memory.minerals[this.id] || {};
    },
    set: function(value) {
        if(_.isUndefined(Memory.minerals)) {
            Memory.minerals = {};
        }
        if(!_.isObject(Memory.minerals)) {
            throw new Error('Could not set memory extension for minerals');
        }
        Memory.minerals[this.id] = value;
    }
});
//======Define Other Property======
Object.defineProperties(Source.prototype, {
    'accessibleFields': {
        configurable: true,
        get: function() {
            if ( this.memory && !_.isUndefined(this.memory.accessibleFields) ) {
                return this.memory.accessibleFields;
            } else {
                const terrain = new Room.Terrain(this.room.name);
                const y = this.pos.y;
                const x = this.pos.x;
                var wallCnt = 0;
                for(let xi=x-1; xi<=x+1; xi++) {
                    for(let yi=y-1; yi<=y+1; yi++) {
                        //traverse fields nearby
                        if(xi===x && yi===y) continue;
                        if(TERRAIN_MASK_WALL === terrain.get(xi, yi)) {
                            wallCnt++;
                        }
                    }
                }
                var accessibleFields = 8-wallCnt;
                return (this.memory) ? this.memory.accessibleFields = accessibleFields : accessibleFields;
            }
        }
    },
    'container': {
        get: function() {
            if (!this._container) {
                if (!this.memory.containerId) {
                    const targets = this.pos.findInRange(this.room.cachedFind(FIND_STRUCTURES), 1, {
                        filter: o => o.structureType == STRUCTURE_CONTAINER || o.structureType == STRUCTURE_STORAGE
                    });
                    const closestTarget = targets[0]; //Same distance, so pick first one
                    if(closestTarget) {
                        this.memory.containerId = closestTarget.id;
                    } else {
                        return false;
                    }
                }
                const obj = Game.getObjectById(this.memory.containerId);
                if(!obj) {
                    //Then we need to reset containerId since it is invalid.
                    this.memory.containerId = false;
                    return false;
                }
                this._container = obj;
            }
            return this._container;
        },
        set: function(container) {
            this.memory.containerId = container.id;
            this._container = container;
        },
        enumerable: false,
        configurable: true
    },
});

Object.defineProperties(Mineral.prototype, {
    'container': {
        get: function() {
            if (!this._container) {
                if (!this.memory.containerId) {
                    const targets = this.pos.findInRange(this.room.cachedFind(FIND_STRUCTURES), 1, {
                        filter: o => o.structureType == STRUCTURE_CONTAINER || o.structureType == STRUCTURE_STORAGE
                    });
                    const closestTarget = targets[0]; //Same distance, so pick first one
                    if(closestTarget) {
                        this.memory.containerId = closestTarget.id;
                    } else {
                        return false;
                    }
                }
                const obj = Game.getObjectById(this.memory.containerId);
                if(!obj) {
                    //Then we need to reset containerId since it is invalid.
                    this.memory.containerId = false;
                    return false;
                }
                this._container = obj;
            }
            return this._container;
        },
        set: function(container) {
            this.memory.containerId = container.id;
            this._container = container;
        },
        enumerable: false,
        configurable: true
    },
    'extractor': {
        get: function() {
            if (!this._extractor) {
                if (!this.memory.extractorId) {
                    if(this.room.controller && this.room.controller.my && this.room.controller.level<6) return false;
                    const structures = _.filter(this.pos.lookFor(LOOK_STRUCTURES), s => s.structureType===STRUCTURE_EXTRACTOR);
                    if(structures.length>0) {
                        const extractorStructure = structures[0];
                        this.memory.extractorId = extractorStructure.id;
                    } else {
                        return false;
                    }
                }
                const obj = Game.getObjectById(this.memory.extractorId);
                if(!obj) {
                    //Then we need to reset containerId since it is invalid.
                    this.memory.extractorId = false;
                    return false;
                }
                this._extractor = obj;
            }
            return this._extractor;
        },
        set: function(extractor) {
            this.memory.extractorId = extractor.id;
            this._extractor = extractor;
        },
        enumerable: false,
        configurable: true
    }
});

Object.defineProperties(StructureController.prototype, {
    'container': {
        get: function() {
            if (!this._container) {
                if (!this.memory.containerId) {
                    const targets = this.pos.findInRange(this.room.cachedFind(FIND_STRUCTURES), 2, {
                        filter: o => o.structureType == STRUCTURE_CONTAINER || o.structureType == STRUCTURE_STORAGE
                    });
                    const closestTarget = this.pos.findClosestByRange(targets);
                    if(closestTarget) {
                        this.memory.containerId = closestTarget.id;
                    } else {
                        return false;
                    }
                }
                const obj = Game.getObjectById(this.memory.containerId);
                if(!obj) {
                    //Then we need to reset containerId since it is invalid.
                    this.memory.containerId = false;
                    return false;
                }
                this._container = obj;
            }
            return this._container;
        },
        set: function(container) {
            this.memory.containerId = container.id;
            this._container = container;
        },
        enumerable: false,
        configurable: true
    },
    //Only use for remote mining
    'canTouch': {
        get: function() {
            return genericGetter(this, 'canTouch', '_canTouch', (self) => {
                return canTouch(self);
            });
        },
        set: function(value) {
            return genericSetter(this, 'canTouch', '_canTouch');
        },
        enumerable: false,
        configurable: true
    },
});

function genericGetter(self, name, internalName, initialFunc) {
    if (!self[internalName]) {
        if (self.memory[name]) {
            self[internalName] = self.memory[name];
        } else {
            self.memory[name] = initialFunc(self);
            self[internalName] = self.memory[name];
        }
    }
    return self[internalName];
}

function genericSetter(self, name, internalName, value) {
    self.memory[name] = value;
    self[internalName] = value;
}

Object.defineProperties(Room.prototype, {
    'layout': {
        get: function() {
            return genericGetter(this, 'layout', '_layout', () => {
                const value = {
                    'init': false,
                    [STRUCTURE_SPAWN]: [],
                    [STRUCTURE_EXTENSION]: [],
                    [STRUCTURE_ROAD]: [],
                    [STRUCTURE_WALL]: [],
                    [STRUCTURE_RAMPART]: [],
                    [STRUCTURE_LINK]: [],
                    [STRUCTURE_STORAGE]: [],
                    [STRUCTURE_TOWER]: [],
                    [STRUCTURE_OBSERVER]: [],
                    [STRUCTURE_POWER_SPAWN]: [],
                    [STRUCTURE_EXTRACTOR]: [],
                    [STRUCTURE_LAB]: [],
                    [STRUCTURE_TERMINAL]: [],
                    [STRUCTURE_CONTAINER]: [],
                    [STRUCTURE_NUKER]: []
                };
                return value;
            });
        },
        set: function(value) {
            return genericSetter(this, 'layout', '_layout');
        },
        enumerable: false,
        configurable: true
    },
    'queue': {
        get: function() {
            return genericGetter(this, 'queue', '_queue', () => {
                return {
                    urgent: [],
                    normal: [],
                    extern: [],
                    lastBalanceTick: 0,
                };
            });
        },
        set: function(queue) {
            return genericSetter(this, 'queue', '_queue');
        },
        enumerable: false,
        configurable: true
    },
    'spawnLink': {
        get: function() {
            if (!this._spawnLink) {
                if (this.memory.spawnLinkId) {
                    const obj = Game.getObjectById(this.memory.spawnLinkId);
                    if(!obj) {
                        this.memory.spawnLinkId = false;
                        return false;
                    }
                    this._spawnLink = obj;
                } else {
                    return false;
                }
            }
            return this._spawnLink;
        },
        set: function(spawnLink) {
            this.memory.spawnLinkId = spawnLink.id;
            this._spawnLink = spawnLink;
        },
        enumerable: false,
        configurable: true
    },
    'sourceLinks': {
        get: function() {
            if (!this._sourceLinks) {
                const sourceLinkIds = this.memory.sourceLinkIds;
                if (sourceLinkIds && sourceLinkIds.length > 0) {
                    this._sourceLinks = _.map(sourceLinkIds, id => Game.getObjectById(id));
                } else {
                    this._sourceLinks = [];
                }
            }
            return this._sourceLinks;
        },
        set: function(sourceLinks) {
            this.memory.sourceLinkIds = _.map(sourceLinks, link => link.id);
            this._sourceLinks = sourceLinks;
        },
        enumerable: false,
        configurable: true
    },
    'controllerLink': {
        get: function() {
            if (!this._controllerLink) {
                if (this.memory.controllerLinkId) {
                    const obj = Game.getObjectById(this.memory.controllerLinkId);
                    if(!obj) {
                        this.memory.controllerLinkId = false;
                        return false;
                    }
                    this._controllerLink = obj;
                } else {
                    return false;
                }
            }
            return this._controllerLink;
        },
        set: function(controllerLink) {
            this.memory.controllerLinkId = controllerLink.id;
            this._controllerLink = controllerLink;
        },
        enumerable: false,
        configurable: true
    },
    'spawns': {
        get: function() {
            if (!this._spawns) {
                const spawnIds = this.memory.spawnIds;
                const spawnLimit = CONTROLLER_STRUCTURES[STRUCTURE_SPAWN][this.controller.level];
                if (spawnIds && spawnIds.length === spawnLimit) {
                    var spawns = _.map(spawnIds, id => Game.getObjectById(id));
                    this._spawns = spawns;
                } else {
                    const roomName = this.name;
                    const spawns = _.filter(Game.spawns, spawn => spawn.room.name===roomName);
                    this.memory.spawnIds = _.map(spawns, spawn => spawn.id);
                    this._spawns = spawns;
                }
            }
            return this._spawns;
        },
        set: function(spawns) {
            this.memory.spawnIds = _.map(spawns, spawn => spawn.id);
            this._spawns = spawns;
        },
        enumerable: false,
        configurable: true
    },
    'sources': {
        get: function() {
            if (!this._sources) {
                const sourceIds = this.memory.sourceIds;
                //If array has no item, re-search and cache it
                if (sourceIds && sourceIds.length > 0) {
                    let sources = _.map(sourceIds, id => Game.getObjectById(id));
                    this._sources = sources;
                } else {
                    const sources = this.cachedFind(FIND_SOURCES);
                    this.memory.sourceIds = _.map(sources, source => source.id);
                    this._sources = sources;
                }
            }
            return this._sources;
        },
        set: function(sources) {
            this.memory.sourceIds = _.map(sources, source => source.id);
            this._sources = sources;
        },
        enumerable: false,
        configurable: true
    },
    'mineral': {
        get: function() {
            if (!this._mineral) {
                const mineralId = this.memory.mineralId;
                if (mineralId) {
                    this._mineral = Game.getObjectById(mineralId);
                } else {
                    const minerals = this.cachedFind(FIND_MINERALS);
                    if(minerals.length>0) {
                        this.memory.mineralId = minerals[0].id;
                        this._mineral = minerals[0];
                    }
                }
            }
            return this._mineral;
        },
        set: function(mineral) {
            this.memory.mineralId = mineral.id;
            this._mineral = mineral;
        },
        enumerable: false,
        configurable: true
    },
});

function canTouch(obj) {
    //Check if there are any constructed walls at adjacent square to obj
    const pos = obj.pos;
    const x = pos.x;
    const y = pos.y;
    let wallCnt = 0;
    const terrain = new Room.Terrain(obj.room.name);

    //Firstly, we check natural wall
    for(let xi=x-1; xi<=x+1; xi++) {
        for(let yi=y-1; yi<=y+1; yi++) {
            //traverse fields nearby
            if(xi===x && yi===y) continue;
            if(TERRAIN_MASK_WALL === terrain.get(xi, yi)) {
                wallCnt++;
            }
        }
    }
    //Then we check constructed wall
    const constructedWalls = _.filter(pos.findInRange(obj.room.cachedFind(FIND_STRUCTURES), 3), o=>o.structureType===STRUCTURE_WALL);
    return constructedWalls.length+wallCnt < 8;
};

Room.prototype.cachedCreeps = function() {
    const self = this;
    return _.filter(Game.creeps, function(creep) { return creep.memory.homeRoom == self.name; });
};

Room.prototype.cachedRoleCount = function() {
    if(this.Cache === undefined) this.Cache = {};
    const internal = '$roleCount';
    if(this.Cache[internal]===undefined) {
        //=== Role count ===
        const self = this;
        const roomCreeps = this.cachedCreeps();
        let cnt = {
            existed: {},
            queue: {},
            total: {},
        };
        _.forEach(Role, o => {
            cnt.existed[o.roleName] = 0;
            cnt.queue[o.roleName] = 0;
            cnt.total[o.roleName] = 0;
        }); //Init cnt
        //Count role existed
        for(let creep of roomCreeps) {
            const role = creep.memory.role;
            cnt.existed[role]++;
            if(creep.spawning || Setup[role] && creep.ticksToLive >= Setup[role].prespawn) {
                //This affect prespawn mechanisim
                cnt.total[role]++;
            }
        }
        //Count role in queue as well
        const queue = this.queue.urgent.concat(this.queue.normal);
        for(let setupName of queue) {
            const role = setupName;
            cnt.queue[role]++;
            cnt.total[role]++;
        }

        this.Cache[internal] = cnt;
    };
    return this.Cache[internal];
};

Room.prototype.cachedFind = function(type) {
    if(this.Cache === undefined) this.Cache = {};
    const internal = '_'+type;
    if(this.Cache[internal]===undefined) {
        this.Cache[internal] = this.find(type);
    }
    return this.Cache[internal];
};

Room.prototype.saveLinks = function() {
    if(this.sourceLink && this.spawnLink && this.controllerLink) return; //Only do search when links is not valid.
    const self = this;
    const links = _.filter(this.cachedFind(FIND_MY_STRUCTURES), { structureType: STRUCTURE_LINK });
    const controller = this.controller;
    const sources = this.cachedFind(FIND_SOURCES);
    const spawnsAndExtensions = _.filter(this.cachedFind(FIND_MY_STRUCTURES), o => o.structureType==STRUCTURE_SPAWN || o.structureType==STRUCTURE_EXTENSION);

    let sourceLinks = [];
    _.forEach(links, link => {
        if(link.pos.inRangeTo(controller, 3)) {
            self.controllerLink = link;
        } else if(link.pos.findInRange(sources, 2).length) {
            sourceLinks.push(link);
        } else if(link.pos.findInRange(spawnsAndExtensions, 3).length) {
            self.spawnLink = link;
        }
    });
    if(sourceLinks.length > 0) {
        this.sourceLinks = sourceLinks;
    }
};

if(!Creep.prototype._moveTo) {
    Creep.prototype._moveTo = Creep.prototype.moveTo;
}

/**
 * Modified from https://github.com/bonzaiferroni/bonzAI/blob/master/src/prototypes/initPrototypes.ts
 * General-purpose cpu-efficient movement function that uses ignoreCreeps: true, a high reusePath value and stuck-detection
 * @param destination
 * @param ops - pathfinding ops, ignoreCreeps and reusePath will be overwritten
 * @param dareDevil
 * @returns {number} - Error code
 */
Creep.prototype.moveTo = function(destination, ops, dareDevil = false) {

    if (this.spawning) {
        return 0;
    }

    if (this.fatigue > 0) {
        return ERR_TIRED;
    }

    if (!this.memory.position) {
        this.memory.position = this.pos;
    }

    if (!ops) {
        ops = {};
    }

    // check if trying to move last tick
    let movingLastTick = true;
    if (!this.memory.lastTickMoving) this.memory.lastTickMoving = 0;
    if (Game.time - this.memory.lastTickMoving > 1) {
        movingLastTick = false;
    }
    this.memory.lastTickMoving = Game.time;

    //Edge check!
    const pos = this.pos;
    const lastPos = this.memory.position;
    //edge check
    if(pos.x === 0 || pos.x === 49 || pos.y === 0 || pos.y === 49) {
        if(lastPos.x === 0 || lastPos.x === 49 || lastPos.y === 0 || lastPos.y === 49) {
            if(this.memory.edgeCounter) {
                this.memory.edgeCounter++;
            } else {
                this.memory.edgeCounter = 1;
            }
        }
    } else {
        this.memory.edgeCounter = 0;
    }
    // check if stuck
    let stuck = pos.inRangeTo(lastPos.x, lastPos.y, 0) || this.memory.edgeCounter>=2;
    this.memory.position = this.pos;
    if (stuck && movingLastTick) {
        if (!this.memory.stuckCount) this.memory.stuckCount = 0;
        if (!this.memory.edgeCounter) this.memory.edgeCounter = 0;
        this.memory.stuckCount++;
        if (dareDevil && this.memory.stuckCount > 0) {
            this.memory.detourTicks = 5;
        }
        else if (this.memory.stuckCount >= 2) {
            this.memory.detourTicks = 5;
            // this.say("excuse me", true);
        }
        if (this.memory.stuckCount > 500 && !this.memory.stuckNoted) {
            Logger.warning(this.name, "is stuck at", this.pos, "stuckCount:", this.memory.stuckCount);
            this.memory.stuckNoted = true;
        }
    }
    else {
        this.memory.stuckCount = 0;
    }

    if (this.memory.detourTicks > 0) {
        this.memory.detourTicks--;
        if (dareDevil) {
            ops.reusePath = 0;
        }
        else {
            ops.reusePath = 5;
        }
        return this._moveTo(destination, ops);
    }
    else {
        ops.reusePath = 50;
        ops.ignoreCreeps = true;
        return this._moveTo(destination, ops);
    }
};

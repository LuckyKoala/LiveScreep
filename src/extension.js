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
//======Define Other Property======
Object.defineProperties(Source.prototype, {
    'accessibleFields': {
        configurable: true,
        get: function() {
            if ( this.memory && !_.isUndefined(this.memory.accessibleFields) ) {
                return this.memory.accessibleFields;
            } else {
                var fields = this.room.lookForAtArea(LOOK_TERRAIN, this.pos.y-1, this.pos.x-1, this.pos.y+1, this.pos.x+1, true);
                let walls = _.countBy( fields , "terrain" ).wall;
                var accessibleFields = walls === undefined ? 9 : 9-walls;
                return (this.memory) ? this.memory.accessibleFields = accessibleFields : accessibleFields;
            }
        }
    },
    'container': {
        get: function() {
            if (!this._container) {
                if (!this.memory.containerId) {
                    const targets = this.pos.findInRange(FIND_STRUCTURES, 1, {
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
});

Object.defineProperties(StructureController.prototype, {
    'container': {
        get: function() {
            if (!this._container) {
                if (!this.memory.containerId) {
                    const targets = this.pos.findInRange(FIND_STRUCTURES, 4, {
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
});

Object.defineProperties(Room.prototype, {
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
    'sourceLink': {
        get: function() {
            if (!this._sourceLink) {
                if (this.memory.sourceLinkId) {
                    const obj = Game.getObjectById(this.memory.sourceLinkId);
                    if(!obj) {
                        this.memory.sourceLinkId = false;
                        return false;
                    }
                    this._sourceLink = obj;
                } else {
                    return false;
                }
            }
            return this._sourceLink;
        },
        set: function(sourceLink) {
            this.memory.sourceLinkId = sourceLink.id;
            this._sourceLink = sourceLink;
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
                if (spawnIds) {
                    var spawns = _.map(spawnIds, id => Game.getObjectById(id));
                    //TODO Validate spawns
                    this._spawns = spawns;
                } else {
                    return false;
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
});
Room.prototype.saveLinks = function() {
    if(this.sourceLink && this.spawnLink && this.controllerLink) return; //Only do search when links is not valid.
    const self = this;
    const links = this.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_LINK }
    });
    const controller = this.controller;
    const sources = this.find(FIND_SOURCES);
    const spawnsAndExtensions = this.find(FIND_MY_STRUCTURES, {
        filter: o => o.structureType==STRUCTURE_SPAWN || o.structureType==STRUCTURE_EXTENSION
    });
    _.forEach(links, link => {
        if(link.pos.inRangeTo(controller, 3)) {
            self.controllerLink = link;
        } else if(link.pos.findInRange(sources, 2).length) {
            self.sourceLink = link;
        } else if(link.pos.findInRange(spawnsAndExtensions, 3).length) {
            self.spawnLink = link;
        }
    });
};
Room.prototype.saveSpawns = function() {
    const roomName = this.name;
    this.spawns = _.filter(Game.spawns, spawn => spawn.room.name===roomName);
};


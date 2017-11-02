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
//TODO Can also used in other room object
Object.defineProperty(Source.prototype, 'accessibleFields', {
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
});

Object.defineProperty(StructureController.prototype, 'container', {
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
        this._container = newValue;
    },
    enumerable: false,
    configurable: true
});

//One container for one source
Object.defineProperty(Source.prototype, 'container', {
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
        this._container = newValue;
    },
    enumerable: false,
    configurable: true
});
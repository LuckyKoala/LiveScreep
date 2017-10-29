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
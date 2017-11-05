//Mark logic goes there
var mod = {};
module.exports = mod;

mod.loop = function() {
    for(var id in Memory.sources) {
        var source = Game.getObjectById(id);
        if(source) this.validateSourceMark(source);
    }
}

/**
 * Common Target Mark System
 * Only work with object which has id property
 * -- Creep --
 * Memory Path: .memory.targetMark
 * = %id%
 */
mod.ensureTargeMarktInitialize = function(creep) {
    if(_.isUndefined(creep.memory.targetMark)) creep.memory.targetMark = {};
    if(!_.isObject(creep.memory.targetMark)) creep.memory.targetMark = {};
}

mod.markTarget = function(creep, targetId, actionSource) {
    this.ensureTargeMarktInitialize(creep);
    if(_.isUndefined(actionSource)) return;
    creep.memory.targetMark[actionSource] = targetId;
}

mod.unmarkTarget = function(creep, actionSource) {
    this.ensureTargeMarktInitialize(creep);
    if(_.isUndefined(actionSource)) return;
    creep.memory.targetMark[actionSource] = false;
}

mod.getMarkTarget = function(creep, actionSource) {
    this.ensureTargeMarktInitialize(creep);
    if(_.isUndefined(actionSource)) return;
    return creep.memory.targetMark[actionSource] || false;
}

mod.handleMark = function(creep, targetInitFunc, actionSource) {
    var targetId = this.getMarkTarget(creep, actionSource);
    var target;

    if(!targetId) {
        target = targetInitFunc(creep);
        if(!target) return false;
        targetId = target.id;
        this.markTarget(creep, targetId, actionSource);
    }
    target = Game.getObjectById(targetId);
    if(!target) this.unmarkTarget(creep, actionSource);
    return target;
}

/**
 * Source Mark System
 *  -- Source --
 * Memory Path: .memory.mark
 * {
 *   available: {
 *     spots: 3, //Near available pos count
 *     parts: 5, //For 5 work max
 *   },
 *   status: {
 *     %creepName%: %creepMarkParts%,
 *   },
 * }
 *  -- Creep ---
 * Memory Path: .memory.sourceMark
 * {
 *   target: %id%,
 * }
 */
const SourcePartsDefault = SOURCE_ENERGY_CAPACITY/ENERGY_REGEN_TIME/HARVEST_POWER; 

mod.initSourceMark = function(source) {
    //FIXME only for normal room
    source.memory.mark = {
        available: {
            spots: source.accessibleFields, 
            parts: SourcePartsDefault, 
        },
        status: {},
    }
}

mod.isSourceAvailable = function(creep, source) {
    this.ensureSourceMarkInitialize(source);
    const needParts = creep.getActiveBodyparts(WORK);
    const available = source.memory.mark.available;
    return available.spots>=1 && available.parts>=needParts;
}

mod.findAndMarkSource = function(creep) {
    var sources = creep.room.find(FIND_SOURCES);
    for(var i=0; i<sources.length; i++) {
        var source = sources[i];
        if(source && this.isSourceAvailable(creep, source)) {
            this.markSource(creep, source);
            return true;
        }
    }
    return false;
}

mod.markSource = function(creep, source) {
    this.ensureSourceMarkInitialize(source);
    //Now mark it
    //Update creep mark
    creep.memory.sourceMark = {
        target: source.id,
    };
    //Update source mark
    var available = source.memory.mark.available;
    var status = source.memory.mark.status;
    var takeParts = creep.getActiveBodyparts(WORK);
    available.spots--;
    available.parts -= takeParts;
    status[creep.name] = takeParts;
    source.memory.mark.available = available;
    source.memory.mark.status = status;
    //Log
    console.log("Mark source [" + source.id + "] by "+creep.name);
}

mod.getMarkSource = function(creep) {
    var id = _.get(creep, 'memory.sourceMark.target', false);
    if(id) {
        return Game.getObjectById(id);
    }
    else {
        return false;
    }
}

mod.validateSourceMark = function(source) {
    this.ensureSourceMarkInitialize(source);
    //Get status
    var available = source.memory.mark.available;
    var status = source.memory.mark.status;
    var updated = false; //Any update needed?
    for(var name in status) {
        if(!Game.creeps[name]) {
            //release
            available.spots++;
            available.parts += status[name];
            delete status[name];
            updated = true;
        }
    }
    if(updated) {
        source.memory.mark.available = available;
        source.memory.mark.status = status;
    }
}

mod.ensureSourceMarkInitialize = function(source) {
    //Has source been initialized?
    if(_.isUndefined(source.memory.mark)) {
        this.initSourceMark(source);
    }
}

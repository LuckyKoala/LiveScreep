//Mark logic goes there
var mod = {};
module.exports = mod;

mod.loop = function() {
    //Do nothing
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

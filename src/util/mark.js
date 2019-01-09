//Mark logic goes there
module.exports = {
    unmarkTarget: function(creep, actionSource) {
        ensureTargeMarktInitialize(creep);
        if(_.isUndefined(actionSource)) return;
        creep.memory.targetMark[actionSource] = false;
    },
    handleMark: function(creep, targetInitFunc, actionSource, validateFunc=false) {
        var targetId = getMarkTarget(creep, actionSource);
        var target;
    
        if(!targetId) {
            target = targetInitFunc(creep);
            if(!target) return false;
            targetId = target.id;
            markTarget(creep, targetId, actionSource);
        }
        target = Game.getObjectById(targetId);
        if(!target || (validateFunc && !validateFunc(creep, target))) this.unmarkTarget(creep, actionSource);
        return target;
    },
};

/**
 * Common Target Mark System
 * Only work with object which has id property
 * -- Creep --
 * Memory Path: .memory.targetMark
 * = %id%
 */
function ensureTargeMarktInitialize(creep) {
    if(_.isUndefined(creep.memory.targetMark)) creep.memory.targetMark = {};
    if(!_.isObject(creep.memory.targetMark)) creep.memory.targetMark = {};
}

function markTarget(creep, targetId, actionSource) {
    ensureTargeMarktInitialize(creep);
    if(_.isUndefined(actionSource)) return;
    creep.memory.targetMark[actionSource] = targetId;
}

function getMarkTarget(creep, actionSource) {
    ensureTargeMarktInitialize(creep);
    if(_.isUndefined(actionSource)) return;
    return creep.memory.targetMark[actionSource] || false;
}

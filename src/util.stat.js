//Stat logic goes there
var mod = {};
module.exports = mod;

mod.loop = function() {
    //Do nothing
}

/**
 * Memory Path: Memory.stat.creep.[creepName]
 * use _.set(object, 'a.b.c', 4);
 */
mod.memorizeCreep = function(creep) {
    const entry = {
        id: creep.id,
        roomName: creep.room.name,
        body: creep.body,
        role: creep.memory.role,
    };
    _.set(Memory, ['stat', 'creep', creep.name], entry);
}

mod.forgetCreep = function(creepName) {
    delete Memory.stat.creep[creepName];
}

//Count
mod.memorize = function(key, entry) {
    _.set(Memory, ['stat', 'custom', key], entry);
}
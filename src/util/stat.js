//Stat logic goes there
var mod = {};
module.exports = mod;

mod.loop = function() {
    this.forgetAll(); //GC first
};

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
};

mod.forgetCreep = function(creepName) {
    delete Memory.stat.creep[creepName];
};

//IN: harvest dismantle
//OUT: build maintain repair upgrade
//     tower spawn
const ENERGY_IN = 'energyIn';
const ENERGY_OUT = 'energyOut';
mod.energyIn = function(roomName) {
    return this.getEntry(ENERGY_IN, roomName) || 0;
};
mod.energyOut = function(roomName) {
    return this.getEntry(ENERGY_OUT, roomName) || 0;
};
mod.incEnergyIn = function(roomName, amount) {
    const last = this.energyIn(roomName);
    this.memorize(ENERGY_IN, last+amount, roomName);
};
mod.incEnergyOut = function(roomName, amount) {
    const last = this.energyOut(roomName);
    this.memorize(ENERGY_OUT, last+amount, roomName);
};

//Count
mod.memorize = function(key, entry, roomName) {
    if(roomName) {
        _.set(Memory.rooms, [roomName, 'stat', 'last', key], entry);
    } else {
        _.set(Memory, ['stat', 'last', key], entry);
    }
};

mod.getEntry = function(key, roomName) {
    if(roomName) {
        _.get(Memory.rooms, [roomName, 'stat', 'last', key]);
    } else {
        _.get(Memory, ['stat', 'last', key]);
    }
};

mod.forgetAll = function() {
    //Leave room stat to upper level gc.
    if(Memory.stat) delete Memory.stat.last;
};

//Permanant
mod.find = function(key, defaultValue) {
    return _.get(Memory, ['stat', 'total', key], defaultValue);
};

mod.memorizePermanant = function(key, entry) {
    _.set(Memory, ['stat', 'total', key], entry);
};

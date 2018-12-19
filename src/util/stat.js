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
const ENERGY_HISTORY = 'energyHistory';
const HISTORY_RESET_TICK = 1000;
let energyIn = 0;
let energyOut = 0;
mod.energyIn = function(roomName) {
    return energyIn;
};
mod.energyOut = function(roomName) {
    return energyOut;
};
mod.incEnergyIn = function(roomName, amount) {
    energyIn+=amount;
};
mod.incEnergyOut = function(roomName, amount) {
    energyOut+=amount;
};
mod.sumEnergyHistory = function(roomName) {
    const lastHistory = _.get(Memory.rooms, [roomName, 'stat', ENERGY_HISTORY]) || {
        energyInTotal: 0,
        energyOutTotal: 0,
        tickTotal: 0,
        lastAvgIn: 0,
        lastAvgOut: 0,
    };
    lastHistory.energyInTotal += this.energyIn();
    lastHistory.energyOutTotal += this.energyOut();
    lastHistory.tickTotal ++;
    if(lastHistory.tickTotal > HISTORY_RESET_TICK) {
        //Average and reset total count history
        lastHistory.lastAvgIn = lastHistory.energyInTotal/lastHistory.tickTotal;
        lastHistory.lastAvgOut = lastHistory.energyOutTotal/lastHistory.tickTotal;
        lastHistory.energyInTotal = 0;
        lastHistory.energyOutTotal = 0;
        lastHistory.tickTotal = 0;
    }
    //Reset value of global variable to 0
    energyIn = 0;
    energyOut = 0;
    //Write back to memory
    _.set(Memory.rooms, [roomName, 'stat', ENERGY_HISTORY], lastHistory);
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
        return _.get(Memory.rooms, [roomName, 'stat', 'last', key]);
    } else {
        return _.get(Memory, ['stat', 'last', key]);
    }
};

mod.forgetAll = function() {
    if(Memory.stat) delete Memory.stat.last;
};

//Permanant
mod.find = function(key, defaultValue) {
    return _.get(Memory, ['stat', 'total', key], defaultValue);
};

mod.memorizePermanant = function(key, entry) {
    _.set(Memory, ['stat', 'total', key], entry);
};

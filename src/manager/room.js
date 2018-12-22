const QueueService = require('service_queue');
const SpawnService = require('service_spawn');
const LinkService = require('service_link');
const ConstructionService = require('service_construction');
const TowerService = require('service_tower');

var mod = {};
module.exports = mod;

mod.dispatch = function(room) {
    //TODO Cache room type
    const controller = room.controller;
    if(controller) {
        //Room with controller
        // Then Who owned it?
        if(controller.my) {
            //I owned it!
            this.loopOwnedRoom(room);
        } else {
            //Others owned it
            this.loopExternalRoom(room);
        }
    } else {
        //Room without controller
        const sources = room.find(FIND_SOURCES);
        if(sources.length === 0) {
            //Highway
            this.loopHighway(room);
        } else {
            //Center nine rooms
            const lairs = room.find(FIND_STRUCTURES, {
                filter: { structureType: STRUCTURE_KEEPER_LAIR }
            });
            if(lairs.length === 0) {
                this.loopCenterRoom(room);
            } else {
                this.loopKeeperRoom(room);
            }
        }
    }
};

mod.loopOwnedRoom = function(room) {
    room.saveLinks();

    TowerService.loop(room);
    LinkService.loop(room);
    ConstructionService.loop(room);
    //Init queue before spawn
    QueueService.loop(room);
    SpawnService.loop(room);
    //=== Stat Display ===
    //Game time
    room.visual.text(`Time: ${Game.time}`, 8, 2, {color: 'white', font: 0.8});
    //Spawn queue
    const queue = _.union(room.queue.urgent, room.queue.normal);
    if(queue.length) {
        room.visual.text(`Next creep role is ${queue[0]}`, 8, 3, {color: 'green', font: 0.8});
    } else {
        room.visual.text(`No creep in spawn queue`, 8, 3, {color: 'green', font: 0.8});
    }
    //Energy in and out
    const lastHistory = Util.Stat.getLastHistory(room.name);
    const energyIn = lastHistory.lastAvgIn;
    const energyOut = lastHistory.lastAvgOut;
    const energyDiff = energyIn-energyOut;
    room.visual.text(`AvgEnergy +${energyIn.toFixed(2)} -${energyOut.toFixed(2)} = ${energyDiff.toFixed(2)}`, 8, 4, {color: 'green', font: 0.8});
    //Controller progress
    const progress = room.controller.progress;
    const progressTotal = room.controller.progressTotal;
    const percent = (progress/progressTotal).toFixed(2);
    room.visual.text(`Progress: ${progress}/${progressTotal}(${percent})`, 8, 5, {color: 'gold', font: 0.8});
    //Energy in storage
    if(room.storage) {
        room.visual.text(`Energy in storage: ${room.storage.store[RESOURCE_ENERGY]}`, 8, 6, {color: 'gold', font: 0.8});
    }
};

//If we have vision of unowned room, record when
// it was last seen.
mod.recordLastSeen = function(roomName) {
    if(Memory.rooms[roomName] === undefined) {
        Memory.rooms[roomName] = {};
    }
    Memory.rooms[roomName].lastSeen = Game.time;
};

mod.expireRoom = function(roomName) {
    const ExpirePeriod = 3000;
    const lastSeen = Memory.rooms[roomName].lastSeen || 0;
    if(Game.time - lastSeen > ExpirePeriod) {
        delete Memory.rooms[roomName];
        console.log('Clearing expired room memory: ', roomName);
    }
};

mod.loopExternalRoom = function(room) {
    this.recordLastSeen(room.name);
    //Do a task
    //1. Remote Mining
    //2. Invading
    //3. Scouting
};

mod.loopHighway = function(room) {
    this.recordLastSeen(room.name);
    //Travel or teleport
};

mod.loopCenterRoom = function(room) {
    this.recordLastSeen(room.name);
    //Remote mining
};

mod.loopKeeperRoom = function(room) {
    this.recordLastSeen(room.name);
    //Remote Mining
    //Handle creeps from KeeperLair
};

const SpawnService = require('service_spawn');
const LinkService = require('service_link');
const ConstructionService = require('service_construction');
const TowerService = require('service_tower');

var mod = {};
module.exports = mod;

mod.loop = function() {
    const self = this;
    _.forEach(Game.rooms, room => self.dispatch(room));
};

mod.dispatch = function(room) {
    let roomType = room.memory.roomType;
    if(!roomType) {
        const controller = room.controller;
        if(controller) {
            //Room with controller
            // Then Who owned it?
            if(controller.my) {
                //I owned it!
                roomType = C.OWNED_ROOM;
                room.memory.roomType = roomType;
            } else {
                //Others owned it
                roomType = C.EXTERNAL_ROOM;
                room.memory.roomType = roomType;
            }
        } else {
            //Room without controller
            const sources = room.sources;
            if(sources.length === 0) {
                //Highway
                roomType = C.HIGH_WAY;
                room.memory.roomType = roomType;
            } else {
                //Center nine rooms
                const lairs = _.filter(room.cachedFind(FIND_STRUCTURES), { structureType: STRUCTURE_KEEPER_LAIR });
                if(lairs.length === 0) {
                    roomType = C.CENTER_ROOM;
                    room.memory.roomType = roomType;
                } else {
                    roomType = C.KEEPER_ROOM;
                    room.memory.roomType = roomType;
                }
            }
        }
    }

    switch(roomType) {
    case C.OWNED_ROOM:
        this.loopOwnedRoom(room);
        break;
    case C.EXTERNAL_ROOM:
        this.loopExternalRoom(room);
        break;
    case C.HIGH_WAY:
        this.loopHighway(room);
        break;
    case C.CENTER_ROOM:
        this.loopCenterRoom(room);
        break;
    case C.KEEPER_ROOM:
        this.loopKeeperRoom(room);
        break;
    default:
        console.log('Undefined room type');
    }

};

mod.loopOwnedRoom = function(room) {
    room.saveLinks();

    Util.Defense.tryActivateSafeMode(room);
    TowerService.loop(room);
    LinkService.loop(room);
    ConstructionService.loop(room);
    //Init queue before spawn
    SpawnService.loop(room);
    //Energy history
    Util.Stat.sumEnergyHistory(room.name);
    //=== Stat Display ===
    //Game time
    room.visual.text(`Time: ${Game.time}`, 8, 2, {color: 'white', font: 1});
    //Spawn queue
    const queue = room.queue.urgent.concat(room.queue.normal);
    for(const arr of room.queue.extern) {
        queue.push(arr[0]);
    }
    if(queue.length) {
        room.visual.text(`Next role is ${queue[0]}, remain ${queue.length}`, 8, 3, {color: 'green', font: 1});
    } else {
        room.visual.text(`No creep in spawn queue`, 8, 3, {color: 'green', font: 1});
    }
    //Energy in and out
    const lastHistory = Util.Stat.getLastHistory(room.name);
    const energyIn = lastHistory.lastAvgIn;
    const energyOut = lastHistory.lastAvgOut;
    const energyDiff = energyIn-energyOut;
    room.visual.text(`AvgEnergy +${energyIn.toFixed(2)} -${energyOut.toFixed(2)} = ${energyDiff.toFixed(2)}`, 8, 4, {color: 'green', font: 1});
    //Controller progress
    const progress = room.controller.progress;
    const progressTotal = room.controller.progressTotal;
    const percent = (progress/progressTotal).toFixed(2);
    room.visual.text(`Progress: ${progress}/${progressTotal}(${percent})`, 8, 5, {color: 'gold', font: 1});
    //Energy in storage
    if(room.storage) {
        room.visual.text(`Energy in storage: ${room.storage.store[RESOURCE_ENERGY]}`, 8, 6, {color: 'gold', font: 1});
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
    const reservation = room.controller.reservation;
    if(reservation && reservation.username === C.USERNAME) {
        //=== Stat Display ===
        //Game time
        room.visual.text(`Time: ${Game.time}`, 8, 1, {color: 'white', font: 1.5});
        //Reservation
        room.visual.text(`TicksToEnd: ${reservation.ticksToEnd}`, 8, 3, {color: 'green', font: 1.5});
    }
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

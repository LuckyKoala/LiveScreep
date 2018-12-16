const LinkService = require('service_link');
const ConstructionService = require('service_construction');
const SpawnService = require('service_spawn');
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
    console.log('OwnedRoom');
    room.saveLinks();
    room.saveSpawns();

    ConstructionService.loop(room);
    SpawnService.loop(room);
    TowerService.loop(room);
    LinkService.loop(room);
};

mod.loopExternalRoom = function(room) {
    console.log('ExternalRoom');
    //Do a task
    //1. Remote Mining
    //2. Invading
    //3. Scouting
};

mod.loopHighway = function(room) {
    console.log('Highway');
    //Travel or teleport
};

mod.loopCenterRoom = function(room) {
    console.log('CenterRoom');
    //Remote mining
};

mod.loopKeeperRoom = function(room) {
    console.log('KeeperRoom');
    //Remote Mining
    //Handle creeps from KeeperLair
};

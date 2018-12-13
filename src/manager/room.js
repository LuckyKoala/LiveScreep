const LinkService = require('service_link');
const ConstructionService = require('service_construction');
const SpawnService = require('service_spawn');
const TowerService = require('service_tower');

var mod = {};
module.exports = mod;

mod.loop = function(room) {
    room.saveLinks();
    room.saveSpawns();

    ConstructionService.loop(room);
    SpawnService.loop(room);
    TowerService.loop(room);
    LinkService.loop(room);
};

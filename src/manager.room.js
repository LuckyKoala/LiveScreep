const LinkService = require('service.link');
const ConstructionService = require('service.construction');
const SpawnService = require('service.spawn');

var mod = {};
module.exports = mod;

mod.loop = function(room) {
    room.saveLinks();
    room.saveSpawns();

    ConstructionService.loop(room);
    SpawnService.loop(room);
    Util.Tower.loop(room);
    LinkService.loop(room);
}
var mod = {};
module.exports = mod;

mod.loop = function(room) {
    room.saveLinks();
    Util.Construction.loop(room);
    Util.Spawner.loop(room);
    Util.Tower.loop(room);
    Util.Link.loop(room);
}
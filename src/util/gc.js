//GC logic goes there
var mod = {};
module.exports = mod;

mod.loop = function() {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory: ', name);
        }
    }
    for(var id in Memory.structures) {
        if(!Game.getObjectById(id)) {
            delete Memory.structures[id];
            console.log('Clearing non-existing structure memory: ', id);
        }
    }
    //Consider do gc for Memory.rooms
}
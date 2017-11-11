//Link logic goes there
var mod = {};
module.exports = mod;

mod.loop = function(room) {
    const spawnLink = room.spawnLink;
    const sourceLink = room.sourceLink;
    const controllerLink = room.controllerLink;

    if(sourceLink.cooldown==0 && sourceLink.energy==sourceLink.energyCapacity
        && spawnLink.energy==0) {
        sourceLink.transferEnergy(spawnLink);
    } else if(sourceLink.cooldown==0 && sourceLink.energy==sourceLink.energyCapacity
        && controllerLink.energy==0) {
        sourceLink.transferEnergy(controllerLink);
    }
}
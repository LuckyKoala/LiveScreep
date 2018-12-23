//Link logic goes there
var mod = {};
module.exports = mod;

mod.loop = function(room) {
    const spawnLink = room.spawnLink;
    const sourceLinks = room.sourceLinks;
    const controllerLink = room.controllerLink;

    for(const sourceLink of sourceLinks) {
        if(sourceLink.cooldown === 0 && sourceLink.energy === sourceLink.energyCapacity) {
            if(spawnLink.energy==0) {
                //First we ensure spawnLink have energy remain
                sourceLink.transferEnergy(spawnLink);
            } else if(controllerLink.energy==0) {
                //Then we can transfer energy to controllerLink
                sourceLink.transferEnergy(controllerLink);
            }
        }
    }
};

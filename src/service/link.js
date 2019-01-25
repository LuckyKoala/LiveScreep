//Link logic goes there
var mod = {};
module.exports = mod;

mod.loop = function(room) {
    const inputLinks = [];
    const outputLinks = [];

    const fullAndNotCooldown = function(link) {
        return link.energy===link.energyCapacity && link.cooldown===0;
    };
    for(const link of room.links) {
        let linkType = link.memory.type;
        if(linkType === undefined) {
            if(link.pos.inRangeTo(room.controller, 3)) {
                linkType = 'controller';
            } else {
                const spawnsAndExtensions = room.cachedFind(FIND_MY_STRUCTURES).filter(s => s.structureType===STRUCTURE_SPAWN || s.structureType===STRUCTURE_EXTENSION);
                if(link.pos.findInRange(spawnsAndExtensions, 4).length > 0) {
                    linkType = 'center';
                } else {
                    linkType = 'source';
                }
            }
        }

        if(linkType==='source') {
            if(fullAndNotCooldown(link)) inputLinks.push(link);
        } else if(link.energy===0) outputLinks.push(link);

        //write back to memory
        link.memory.type = linkType;
    }

    for(const input of inputLinks) {
        if(outputLinks.length > 0) {
            input.transferEnergy(outputLinks.pop());
        }
    }
};

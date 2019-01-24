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
        if(link.memory.marked) {
            if(link.memory.source) {
                if(fullAndNotCooldown(link)) inputLinks.push(link);
            }
            else if(link.energy===0) outputLinks.push(link);
        } else {
            let marked = false;
            if(link.pos.findInRange(room.controller, 2).length > 0) {
                link.memory.controller = true;
                marked = true;
            }
            const spawnsAndExtensions = room.cachedFind(FIND_MY_STRUCTURES).filter(s => s.structureType===STRUCTURE_SPAWN || s.structureType===STRUCTURE_EXTENSION);
            if(link.pos.findInRange(spawnsAndExtensions, 2).length > 0) {
                link.memory.center = true;
                marked = true;
            }

            if(!marked) link.memory.source = true;
            link.memory.marked = true;
        }
    }

    for(const input of inputLinks) {
        if(outputLinks.length > 0) {
            input.transferEnergy(outputLinks.pop());
        }
    }
};

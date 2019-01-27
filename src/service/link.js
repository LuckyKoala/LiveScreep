//Link logic goes there
var mod = {};
module.exports = mod;

mod.loop = function(room) {
    let sourceLinks = [];
    let centerLink = false;
    let controllerLink = false;

    const fullAndNotCooldown = function(link) {
        return link.energy===link.energyCapacity && link.cooldown===0;
    };
    const empty = function(link) {
        return link.energy===0;
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
            //write back to memory
            link.memory.type = linkType;
        }

        switch(linkType) {
            case 'source':
                if(fullAndNotCooldown(link)) sourceLinks.push(link);
                break;
            case 'center':
                centerLink = link;
                break;
            case 'controller':
                if(empty(link)) controllerLink = link;
                break;
        }
    }

    //all source link -> center link
    //centerlink -> empty controllerLink
    if(centerLink) {
        if(centerLink.energy>0 && controllerLink) centerLink.transferEnergy(controllerLink);
        if(empty(centerLink)) {
            if(sourceLinks.length > 0) {
                const sourceLink = sourceLinks[0];
                if(centerLink) sourceLink.transferEnergy(centerLink);
                else if(controllerLink) sourceLink.transferEnergy(controllerLink);
            }
        }
    } else if(controllerLink) {
        if(sourceLinks.length > 0) {
            const sourceLink = sourceLinks[0];
            sourceLink.transferEnergy(controllerLink);
        }
    }
};

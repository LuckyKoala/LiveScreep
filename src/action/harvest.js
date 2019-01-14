let mod = new ActionObj('Harvest');
module.exports = mod;

mod.nextTarget = function() {
    const creep = this.creep;
    let markSource = Util.SourceMark.getMarkSource(creep);

    if(!markSource) {
        const role = creep.memory.role;
        const dynamic = role!==C.HARVESTER && role!==C.REMOTE_HARVESTER;
        //Not found
        Logger.trace("Finding unmark source => "+creep.name);
        const found = Util.SourceMark.findAndMarkSource(creep, dynamic);
        if(found) {
            markSource = Util.SourceMark.getMarkSource(creep);
        }
    }

    return markSource;
};

mod.word = '⛏ harvest';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        const source = target;
        const container = target.container;
        let moved = false;
        if(container && container.pos.isNearTo(source)) {
            const role = creep.memory.role;
            const range = (role===C.HARVESTER || role===C.REMOTE_HARVESTER) ? 0 : 1;
            if(!creep.pos.inRangeTo(container, range)) {
                creep.moveTo(container, {range: range, maxRooms: 1, visualizePathStyle: {stroke: '#ffaa00'}});
                moved = true;
            }
        }

        if(creep.pos.isNearTo(source)) {
            if(source.energy > 0) {
                //Only do harvest if source has energy remain, save 0.2 CPU!
                let result = creep.harvest(source);
                if(result===OK) {
                    let amount = creep.getActiveBodyparts(WORK)*HARVEST_POWER;
                    Util.Stat.incEnergyIn(creep.memory.homeRoom, amount);
                }
            } else {
                //This source has no energy remain!
                //Go find another source available
                const role = creep.memory.role;
                const dynamic = role!==C.HARVESTER && role!==C.REMOTE_HARVESTER;
                if(dynamic) Util.SourceMark.clearSourceMark(creep);
            }
        } else {
            if(!moved) creep.moveTo(source, {range: 1, maxRooms: 1, visualizePathStyle: {stroke: '#ffaa00'}});
        }
    });
};


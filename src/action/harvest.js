let mod = new ActionObj('Harvest');
module.exports = mod;

mod.nextTarget = function() {
    const creep = this.creep;
    let dynamic = false;
    if(creep.memory.role===C.PIONEER || creep.memory.role===C.REMOTE_WORKER) {
        dynamic = true;
    }
    let markSource = Util.SourceMark.getMarkSource(creep);

    if(!markSource) {
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
        let container = target.container;
        container = (container && source.pos.isNearTo(container)) ? container : false;
        const containerNotTaken = container && container.pos.lookFor(LOOK_CREEPS).length == 0;
        const doHarvest = function() {
            if(source.energy > 0) {
                //Only do harvest if source has energy remain, save 0.2 CPU!
                let result = creep.harvest(source);
                if(result===OK) {
                    let amount = creep.getActiveBodyparts(WORK)*HARVEST_POWER;
                    Util.Stat.incEnergyIn(creep.memory.homeRoom, amount);
                }
            }
        };

        if(containerNotTaken) {
            //Try stay above the container
            if(creep.pos.isEqualTo(container)) {
                doHarvest();
            } else {
                creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            if(creep.pos.isNearTo(source)) {
                doHarvest();
            } else {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    });
};


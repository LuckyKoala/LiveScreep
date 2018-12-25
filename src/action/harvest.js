let mod = new ActionObj('Harvest');
module.exports = mod;

mod.nextTarget = function() {
    const creep = this.creep;
    var markSource = Util.SourceMark.getMarkSource(creep);

    if(!markSource) {
        //Not found
        console.log("Finding unmark source => "+creep.name);
        let found = Util.SourceMark.findAndMarkSource(creep);
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
        var container = target.container;
        container = (container && source.pos.isNearTo(container)) ? container : false;
        const containerNotTaken = container && container.pos.lookFor(LOOK_CREEPS).length == 0;

        if(containerNotTaken) {
            //Try stay above the container
            if(creep.pos.isEqualTo(container)) {
                let result = creep.harvest(source);
                if(result===OK) {
                    let amount = creep.getActiveBodyparts(WORK)*HARVEST_POWER;
                    Util.Stat.incEnergyIn(creep.memory.homeRoom, amount);
                }
            } else {
                creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            if(creep.pos.isNearTo(source)) {
                let result = creep.harvest(source);
                if(result===OK) {
                    let amount = creep.getActiveBodyparts(WORK)*HARVEST_POWER;
                    Util.Stat.incEnergyIn(creep.memory.homeRoom, amount);
                }
            } else {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    });
};


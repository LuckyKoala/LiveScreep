let mod = new ActionObj('Harvest');
module.exports = mod;

mod.nextTarget = function() {
    const creep = this.creep;
    var markSource = Util.Mark.getMarkSource(creep);

    if(!markSource) {
        //Not found
        console.log("Finding unmark source => "+creep.name);
        Util.Mark.findAndMarkSource(creep);
        markSource = Util.Mark.getMarkSource(creep);
    }

    return markSource;
};

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    });
};


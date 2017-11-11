let mod = new ActionObj('Harvest');
module.exports = mod;

mod.nextTarget = function() {
    const creep = this.creep;
    var markSource = Util.SourceMark.getMarkSource(creep);

    if(!markSource) {
        //Not found
        console.log("Finding unmark source => "+creep.name);
        Util.Mark.findAndMarkSource(creep);
        markSource = Util.SourceMark.getMarkSource(creep);
    }

    return markSource;
};

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        const source = target;
        var container = target.container;
        container = (container && source.pos.isNearTo(container)) ? container : false;
        const containerNotTaken = container && container.pos.lookFor(LOOK_CREEPS).length == 0;

        if(containerNotTaken) {
            //Try stay above the container
            if(creep.pos.isEqualTo(container)) {
                creep.harvest(source);
            } else {
                creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            if(creep.pos.isNearTo(source)) {
                creep.harvest(source);
            } else {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    });
};


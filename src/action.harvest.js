let mod = new ActionObj('Harvest');
module.exports = mod;

mod.nextTarget = function() {
    const creep = this.creep;
    var markSource = Game.getObjectById(creep.memory.sourceId);

    if(!markSource) {
        console.log("Finding unmark source => "+creep.name);
        var sources = creep.room.find(FIND_SOURCES);
        for(var i=0; i<sources.length; i++) {
            var source = sources[i];
            var currentHarvesterId = source.memory.harvesterId;
            if(currentHarvesterId) {
                //Id exist
                //Validate harvester
                var currentHarvester = Game.getObjectById(currentHarvesterId);
                if(currentHarvester) {
                    if(currentHarvester.memory.sourceId != source.id) {
                        //Reset if unmatch
                        source.memory.harvesterId = undefined;
                        currentHarvester.memory.sourceId = undefined;
                    } 
                } else {
                    //Mark this if can't find matched harvester
                    source.memory.harvesterId = creep.id;
                    creep.memory.sourceId = source.id;
                }
            } else {
                //Mark
                console.log("Mark empty => "+creep.name);
                source.memory.harvesterId = creep.id;
                creep.memory.sourceId = source.id;
            }
        }

        markSource = Game.getObjectById(creep.memory.sourceId);
    }

    return markSource || false;
};

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    });
};


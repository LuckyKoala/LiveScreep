let mod = new ActionObj('Harvest');
module.exports = mod;

mod.nextTarget = function() {
    const creep = this.creep;
    var markSource = Game.getObjectById(creep.memory.sourceId);

    if(!markSource) {
        //Not found
        console.log("Finding unmark source => "+creep.name);
        var sources = creep.room.find(FIND_SOURCES);
        for(var i=0; i<sources.length; i++) {
            var source = sources[i];
            var memorizedName = source.memory.harvesterName;
            if(!_.isUndefined(memorizedName)) {
                const memorizedCreep = Game.creeps[memorizedName];
                if(_.isUndefined(memorizedCreep)) {
                    //Then it hasn't been taken
                    // Mark it
                    console.log("Mark which used to be taken => "+creep.name);
                    source.memory.harvesterName = creep.name;
                    creep.memory.sourceId = source.id;
                    break;
                }
            } else {
                //Then it hasn't been taken
                // Mark it
                console.log("Mark empty => "+creep.name);
                source.memory.harvesterName = creep.name;
                creep.memory.sourceId = source.id;
                break;
            }
        }
        markSource = Game.getObjectById(creep.memory.sourceId);
    } else {
        //Validate
        if(markSource.memory.harvesterName != creep.name) {
            //Honour Creep's memory
            console.log("Honour creeps's memory => "+creep.name);
            markSource.memory.harvesterName = creep.name;
        }
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


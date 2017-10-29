let mod = new ActionObj('Harvest');
module.exports = mod;

mod.nextTarget = function() {
    var targets = this.creep.room.find(FIND_SOURCES);
    return targets.length>0 ? targets[0] : false;
};

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
        /*
        //It will save cpu if maintain container in Action.Put
        //Maintain container if found
        var objs = creep.pos.LOOK_STRUCTURES(LOOK_STRUCTURES);
        if(objs.length && objs[0].structureType == STRUCTURE_CONTAINER) {
            var container = objs[0];
            creep.repair(container);
        }
        */
    });
};


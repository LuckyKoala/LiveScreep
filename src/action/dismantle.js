let mod = new ActionObj('Dismantle');
module.exports = mod;

mod.nextTarget = function() {
    return this.creep.pos.findClosestByRange(FIND_FLAGS, {
        filter: o => FlagUtil.dismantle.examine(o)
    });
};

mod.word = '🚧 dismantle';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        const structures = target.pos.lookFor(LOOK_STRUCTURES);
        //console.log('Loop dimantle action whose target is '+JSON.stringify(structures));
        if(structures.length) {
            const result = creep.dismantle(structures[0]);
            if(result == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            } else if(result == OK) {
                //Do nothing
            }
        } else {
            target.remove(); //Remove flag since there is no structures to dismantle
        }
    });
};

let mod = new ActionObj('Dismantle');
module.exports = mod;

const DismantleFlag = {
    color: COLOR_RED,
    secondaryColor: COLOR_RED,
}
mod.nextTarget = function() {
    return creep.pos.findClosestByRange(FIND_FLAGS, {
        filter: function(o) {
            return o.color==DismantleFlag.color && o.secondaryColor==DismantleFlag.secondaryColor;
        }
    });
};

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
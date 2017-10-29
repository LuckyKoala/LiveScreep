let mod = new ActionObj('Pickup');
module.exports = mod;

mod.nextTarget = function() {
    //TODO Honour range and amount
    return this.creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES); 
};

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    });
};
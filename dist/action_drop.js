let mod = new ActionObj('Drop');
module.exports = mod;

mod.nextTarget = function() {
    return true;
};

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        creep.drop(RESOURCE_ENERGY);
    });
};
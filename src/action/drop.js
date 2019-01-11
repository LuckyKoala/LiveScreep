let mod = new ActionObj('Drop');
module.exports = mod;

mod.nextTarget = function() {
    return _.sum(this.creep.carry) > 0;
};

mod.word = '⬇︎ drop';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        for(const resourceType in creep.carry) {
            creep.drop(resourceType);
        }
    });
};

let mod = new ActionObj('Idle');
module.exports = mod;

mod.nextTarget = function() {
    return false;
};

mod.word = '🍽︎ idle';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        return false;
    });
};

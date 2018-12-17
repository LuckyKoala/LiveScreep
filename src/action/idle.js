let mod = new ActionObj('Idle');
module.exports = mod;

mod.nextTarget = function() {
    return true; //Fake target
};

mod.word = '🍽︎ idle';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        return true;
    });
};

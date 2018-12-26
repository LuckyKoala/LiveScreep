let mod = new ActionObj('Idle');
module.exports = mod;

mod.nextTarget = function() {
    return true;
};

mod.word = '🍽︎ idle';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        //Do random move
        const dir = Math.ceil(Math.random() * 8);
        creep.move(dir);
        
        return false;
    });
};

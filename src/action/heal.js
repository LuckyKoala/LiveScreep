let mod = new ActionObj('Heal');
module.exports = mod;

//Try self healing or set healing status to make creep go home
mod.nextTarget = function() {
    const creep = this.creep;
    if(creep.hits<creep.hitsMax) {
        if(creep.getActiveBodyparts(HEAL) > 0) return creep;
        else creep.memory.healing = true;
    } else {
        creep.memory.healing = false;
    }
    return false;
};

mod.word = '🛡 heal';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        creep.heal(target);
    });
};

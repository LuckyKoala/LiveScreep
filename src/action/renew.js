let mod = new ActionObj('Renew');
module.exports = mod;

//TODO When we need to be renew?
//TODO Maybe we should mark the spawn
mod.nextTarget = function() {
    const creep = this.creep;
    const spawns = creep.room.spawns;
    if(spawns.length>0) return spawns;
    else return false;
};

mod.word = '🕵︎ Claim';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        const result = target.renewCreep(creep);
        if(result === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        } else if(result === OK) {
            //Do nothing
        }
    });
};

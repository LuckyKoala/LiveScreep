var mod = new SetupObj('Guardian');
module.exports = mod;

mod.setupConfig = {
    Normal: {
        minEnergy: 130,
        essBody: [ATTACK, MOVE],
        extraBody: [ATTACK, TOUGH, MOVE],
        maxExtraAmount: 2,
        prefix: '[Guardian]',
        memory: {role: 'guardian'},
    },
};

//TODO honour threat value
mod.shouldSpawn = function(room, cnt) {
    const hostiles = room.find(FIND_HOSTILE_CREEPS);
    const existCount = cnt[lowerFirst(this.setupName)];
    return hostiles.length && Util.War.shouldSpawnGuardian(room) 
        && (_.isUndefined(existCount) || existCount < 1);
};
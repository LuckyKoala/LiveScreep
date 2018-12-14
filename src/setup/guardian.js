var mod = new SetupObj('Guardian');
module.exports = mod;

//FIXME Guard in some places instead of going out
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

//FIXME Only spawn guard when energy is enough and we can survive after somehow
mod.shouldSpawn = function(room, cnt) {
    const existCount = cnt[lowerFirst(this.setupName)];
    return Util.Defense.shouldSpawnGuardian(room) 
        && (_.isUndefined(existCount) || existCount < 1);
};

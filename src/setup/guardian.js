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

var mod = new SetupObj('RemoteGuardian');
module.exports = mod;

mod.setupConfig = {
    Normal: {
        minEnergy: 350,
        essBody: [TOUGH, TOUGH, MOVE, TOUGH, TOUGH, MOVE, ATTACK, ATTACK, MOVE],
        extraBody: [TOUGH, RANGED_ATTACK, MOVE],
        maxExtraAmount: 1,
        prefix: '[RGuardian]',
        memory: {role: 'RemoteGuardian'},
    },
};

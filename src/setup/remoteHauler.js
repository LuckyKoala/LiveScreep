var mod = new SetupObj('RemoteHauler');
module.exports = mod;

mod.setupConfig = {
    Low: {
        minEnergy: 150,
        essBody: [CARRY, CARRY, MOVE],
        extraBody: [CARRY, CARRY, MOVE],
        maxExtraAmount: 1,
        prefix: '[LowRHauler]',
        memory: {role: 'RemoteHauler'},
    },
    Normal: {
        minEnergy: 450,
        essBody: [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE],
        extraBody: [CARRY, CARRY, MOVE],
        maxExtraAmount: 2,
        prefix: '[RHauler]',
        memory: {role: 'RemoteHauler'},
    },
};

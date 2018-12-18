var mod = new SetupObj('Worker');
module.exports = mod;

mod.setupConfig = {
    Normal: {
        essBody: [WORK, CARRY, MOVE],
        extraBody: [WORK, CARRY, MOVE],
        prefix: '[Worker]',
        memory: {role: 'worker'},
    },
};

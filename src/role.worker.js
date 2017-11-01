var mod = new RoleObj('Worker');
module.exports = mod;

mod.Setup = {
    essBody: [WORK, CARRY, MOVE],
    extraBody: [WORK, CARRY, MOVE],
    prefix: '[Worker]',
    memory: {role: 'worker'},
};

mod.roleConfig = {
    inStack: [Action.Harvest],
    outStack: [Action.Feed],
};

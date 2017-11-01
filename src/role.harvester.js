var mod = new RoleObj('Harvester');
module.exports = mod;

mod.Setup = {
    essBody: [WORK,WORK,WORK,WORK,CARRY,MOVE],
    extraBody: [WORK, MOVE],
    maxExtraAmount: 1,
    prefix: '[Harvester]',
    memory: {role: 'harvester'},
};

mod.roleConfig = {
    inStack: [Action.Harvest],
    outStack: [Action.Put, Action.Drop], 
};

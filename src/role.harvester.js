var mod = new RoleObj('Harvester');
module.exports = mod;

mod.Setup = {
    essBody: [WORK, CARRY, MOVE],
    extraBody: [WORK, WORK, MOVE],
    prefix: '[Harvester]',
    memory: {role: 'harvester'},
};

mod.roleConfig = {
    inStack: [Action.Harvest],
    outStack: [Action.Put, Action.Drop], //Only be used when harvester has active carry part
};

var mod = new RoleObj('Harvester');
module.exports = mod;

mod.Setup = {
    Low: {
        minEnergy: 300,
        essBody: [WORK,WORK,CARRY,MOVE],
        extraBody: [WORK, MOVE],
        maxExtraAmount: 1,
        prefix: '[LowHarvester]',
        memory: {role: 'harvester'},
    },
    Normal: {
        minEnergy: 500,
        essBody: [WORK,WORK,WORK,WORK,CARRY,MOVE],
        extraBody: [WORK, MOVE],
        maxExtraAmount: 1,
        prefix: '[Harvester]',
        memory: {role: 'harvester'},
    },
};

mod.roleConfig = {
    inStack: [Action.Harvest],
    outStack: [Action.Put, Action.Drop], 
};

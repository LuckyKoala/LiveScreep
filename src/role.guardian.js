var mod = new RoleObj('Guardian');
module.exports = mod;

mod.Setup = {
    Normal: {
        minEnergy: 130,
        essBody: [ATTACK, MOVE],
        extraBody: [ATTACK, TOUGH, MOVE],
        maxExtraAmount: 2,
        prefix: '[Guardian]',
        memory: {role: 'guardian'},
    },
};

mod.roleConfig = {
    inStack: [],
    outStack: [Action.Guard],
};

mod.loop = function(creep) {
    this.loop0(creep, true); //Always use action in outStack
};
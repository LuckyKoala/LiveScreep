var mod = new RoleObj('Guardian');
module.exports = mod;

mod.Setup = {
    essBody: [ATTACK, MOVE],
    extraBody: [ATTACK, TOUGH, MOVE],
    prefix: '[Guardian]',
    memory: {role: 'guardian'},
};

mod.roleConfig = {
    inStack: [],
    outStack: [Action.Guard],
};

mod.loop = function(creep) {
    this.loop0(creep, true); //Always use action in outStack
};
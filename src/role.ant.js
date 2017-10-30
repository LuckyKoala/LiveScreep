var mod = new RoleObj('Ant');
module.exports = mod;

mod.roleConfig = {
    inStack: [],
    outStack: [Action.Listen],
};

mod.loop = function(creep) {
    this.loop0(creep, true); //Always use action in outStack
};
var mod = new RoleObj(C.GUARDIAN);
module.exports = mod;

mod.roleConfig = {
    inStack: [],
    outStack: [Action.Guard],
};

mod.loop = function(creep) {
    this.loop0(creep, true); //Always use action in outStack
};

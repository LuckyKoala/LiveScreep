var mod = new RoleObj('Recycler');
module.exports = mod;

mod.roleConfig = {
    inStack: [],
    outStack: [Action.Recycle],
};

mod.loop = function(creep) {
    this.loop0(creep, true); //Always use action in outStack
};
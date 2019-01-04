var mod = new RoleObj(C.UPGRADER);
module.exports = mod;

mod.roleConfig = {
    inStack: [],
    outStack: [Action.ComplexUpgrade],
};

mod.loop = function(creep) {
    //Always do actions in outStack
    this.loop0(creep, true);
};

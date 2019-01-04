var mod = new RoleObj(C.RESERVER);
module.exports = mod;

mod.roleConfig = {
    inStack: [],
    outStack: [Action.Travel, Action.Sign, Action.Reserve],
};

mod.loop = function(creep) {
    this.loop0(creep, true);
};

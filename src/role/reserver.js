var mod = new RoleObj('Reserver');
module.exports = mod;

mod.roleConfig = {
    inStack: [],
    outStack: [Action.Travel, Action.Reserve],
};

mod.loop = function(creep) {
    this.loop0(creep, true);
};

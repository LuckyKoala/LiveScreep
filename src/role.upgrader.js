var mod = new RoleObj('Upgrader');
module.exports = mod;

mod.roleConfig = {
    inStack: [],
    outStack: [Action.Upgrade],
};

mod.loop = function(creep) {
    this.loop0(creep, true);
};
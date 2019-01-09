var mod = new RoleObj(C.GUARDIAN);
module.exports = mod;

mod.roleConfig = {
    outStack: [Action.Back, Action.Heal],
    inStack: [Action.Guard, Action.Heal, Action.Travel],
};

mod.loop = function(creep) {
    this.loop0(creep, creep.memory.healing);
};

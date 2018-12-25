var mod = new RoleObj('RemoteGuardian');
module.exports = mod;

mod.roleConfig = {
    outStack: [Action.Back, Action.Heal],
    inStack: [Action.Travel, Action.Guard, Action.Heal],
};

mod.loop = function(creep) {
    this.loop0(creep, creep.memory.healing); //Always use action in outStack
};

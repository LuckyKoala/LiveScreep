var mod = new RoleObj(C.RECYCLER);
module.exports = mod;

//Put remain resources to storage
// and then go to spawn and recycle self
mod.roleConfig = {
    inStack: [Action.Back, Action.Recycle],
    outStack: [Action.Back, Action.PutToStorage, Action.PutToTerminal, Action.Recycle],
};

mod.loop = function(creep) {
    const useOut = creep.getActiveBodyparts(CARRY) == 0 ? false : _.sum(creep.carry) > 0;
    this.loop0(creep, useOut);
};

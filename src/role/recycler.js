var mod = new RoleObj('Recycler');
module.exports = mod;

//Put remain resources to storage
// and then go to spawn and recycle self
mod.roleConfig = {
    inStack: [Action.Back, Action.Recycle],
    outStack: [Action.Back, Action.Store],
};

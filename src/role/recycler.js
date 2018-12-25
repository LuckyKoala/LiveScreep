var mod = new RoleObj('Recycler');
module.exports = mod;

//Put remain resources to storage
// and then go to spawn and recycle self
mod.roleConfig = {
    inStack: [Action.Recycle],
    outStack: [Action.Store],
};

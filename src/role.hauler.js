var mod = new RoleObj('Hauler');
module.exports = mod;

mod.roleConfig = {
    inStack: [Action.Withdraw],
    outStack: [Action.Feed],
};

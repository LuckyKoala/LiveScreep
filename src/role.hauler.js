var mod = new RoleObj('Hauler');
module.exports = mod;

mod.roleConfig = {
    inStack: [Action.Withdraw, Action.Pickup],
    outStack: [Action.Feed, Action.Fuel],
};

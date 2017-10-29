var mod = new RoleObj('Hauler');
module.exports = mod;

mod.roleConfig = {
    inStack: [Action.Withdraw],
    outStack: [Action.Feed],
};
mod.loop = function(creep) {
    if(creep.carry.energy < creep.carryCapacity) {
        var action = this.roleConfig.inStack[0];
        action.loop(creep);
    }
    else {
        var action = this.roleConfig.outStack[0];
        action.loop(creep);
    }
};

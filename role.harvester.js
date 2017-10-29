var mod = new RoleObj('Harvester');
module.exports = mod;

mod.roleConfig = {
    inStack: [Task.Harvest],
    outStack: [Task.Feed],
};
mod.loop = function(creep) {
    if(creep.carry.energy < creep.carryCapacity) {
        var task = this.roleConfig.inStack[0];
        task.loop(creep);
    }
    else {
        var task = this.roleConfig.outStack[0];
        task.loop(creep);
    }
};


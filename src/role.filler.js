//Haul energy from spawn-container to spawn/container
var mod = new RoleObj('Filler');
module.exports = mod;

mod.roleConfig = {
    inStack: [Action.Withdraw, Action.Pickup],
    outStack: [Action.Feed],
};

mod.loop = function(creep) {
    if(creep.memory.filling && creep.carry.energy == 0) {
        creep.memory.filling = false;
        creep.say('🔄 charge');
    }
    if(!creep.memory.filling && creep.carry.energy == creep.carryCapacity) {
        creep.memory.filling = true;
        creep.say('⚡ haul');
    }

    this.loop0(creep, creep.memory.filling);
};

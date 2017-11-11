var mod = new RoleObj('Hauler');
module.exports = mod;

mod.roleConfig = {
    inStack: [Action.Pickup, Action.Withdraw],
    outStack: [Action.Fuel, Action.Put],
};

mod.roleConfigWhenNoStorage = {
    inStack: [Action.Pickup, Action.Withdraw],
    outStack: [Action.Feed, Action.Fuel, Action.Put],
};

mod.loop = function(creep) {
    if(!creep.room.storage) {
        this.roleConfig = this.roleConfigWhenNoControllerContainer;
    }
    
    if(creep.memory.hauling && creep.carry.energy == 0) {
        creep.memory.hauling = false;
        creep.say('🔄 charge');
    }
    if(!creep.memory.hauling && creep.carry.energy == creep.carryCapacity) {
        creep.memory.hauling = true;
        creep.say('⚡ haul');
    }

    this.loop0(creep, creep.memory.hauling);
};

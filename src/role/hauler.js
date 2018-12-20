var mod = new RoleObj('Hauler');
module.exports = mod;

mod.roleConfig = {
    inStack: [Action.Pickup, Action.Withdraw],
    outStack: [Action.Fuel, Action.Put],
};

mod.roleConfigWhenNoStorage = {
    inStack: [Action.Pickup, Action.Withdraw],
    outStack: [Action.Fill, Action.Fuel, Action.Put],
};

mod.loop = function(creep) {
    if(!creep.room.storage) {
        this.roleConfig = this.roleConfigWhenNoStorage;
    }
    
    if(creep.memory.hauling && creep.carry.energy == 0) {
        creep.memory.hauling = false;
    }
    if(!creep.memory.hauling && creep.carry.energy == creep.carryCapacity) {
        creep.memory.hauling = true;
    }

    this.loop0(creep, creep.memory.hauling);
};

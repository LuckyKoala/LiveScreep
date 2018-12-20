var mod = new RoleObj('Hauler');
module.exports = mod;

//If storage is present, then filler and builder will handle energy in storage
// so hauler only haul energy to storage now
mod.roleConfigWithStorage = {
    inStack: [Action.Pickup, Action.Withdraw],
    outStack: [Action.Store],
};

mod.roleConfigWithoutStorage = {
    inStack: [Action.Pickup, Action.Withdraw],
    outStack: [Action.Fill, Action.Fuel, Action.PutForUpgrade],
};

mod.loop = function(creep) {
    //Switch role config
    if(creep.room.storage) {
        this.roleConfig = this.roleConfigWithStorage;
    } else {
        this.roleConfig = this.roleConfigWithoutStorage;
    }
    
    if(creep.memory.hauling && creep.carry.energy == 0) {
        creep.memory.hauling = false;
    }
    if(!creep.memory.hauling && creep.carry.energy == creep.carryCapacity) {
        creep.memory.hauling = true;
    }

    this.loop0(creep, creep.memory.hauling);
};

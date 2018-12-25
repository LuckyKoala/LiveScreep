var mod = new RoleObj('Hauler');
module.exports = mod;

//If storage is present, then filler and builder will handle energy in storage
// so hauler only haul energy to storage now
mod.roleConfigWithStorage = {
    inStack: [Action.Travel, Action.Pickup, Action.Withdraw],
    outStack: [Action.Travel, Action.Fuel, Action.Store],
};

//TODO If there is no storage
// we may choose to abandon mineral resource on creep
mod.roleConfigWithoutStorage = {
    inStack: [Action.Travel, Action.Pickup, Action.Withdraw],
    outStack: [Action.Travel, Action.Fill, Action.Fuel, Action.PutForUpgrade],
};

mod.loop = function(creep) {
    //Switch role config
    if(creep.room.storage) {
        this.roleConfig = this.roleConfigWithStorage;
    } else {
        this.roleConfig = this.roleConfigWithoutStorage;
    }
    
    if(creep.memory.hauling &&  _.sum(creep.carry) === 0) {
        creep.memory.hauling = false;
    }
    if(!creep.memory.hauling && _.sum(creep.carry) === creep.carryCapacity) {
        creep.memory.hauling = true;
    }

    this.loop0(creep, creep.memory.hauling);
};

var mod = new RoleObj(C.REMOTE_HAULER);
module.exports = mod;

//If storage is present, then filler and builder will handle energy in storage
// so hauler only haul energy to storage now
mod.roleConfigWithStorage = {
    inStack: [Action.Travel, Action.Pickup, Action.Withdraw],
    outStack: [Action.Back, Action.Store],
};

mod.roleConfigWithoutStorage = {
    inStack: [Action.Travel, Action.Pickup, Action.Withdraw],
    outStack: [Action.Back, Action.Fill, Action.Fuel, Action.PutForUpgrade],
};

mod.loop = function(creep) {
    //Switch role config
    const homeRoomName = creep.memory.homeRoom;
    const homeRoom = Game.rooms[homeRoomName];
    if(homeRoom.storage) {
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

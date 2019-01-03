var mod = new RoleObj(C.REMOTE_WORKER);
module.exports = mod;

mod.roleConfigWithStorage = {
    inStack: [Action.Travel, Action.Pickup, Action.Harvest],
    outStack: [Action.Back, Action.Store],
};

mod.roleConfigWithoutStorage = {
    inStack: [Action.Travel, Action.Pickup, Action.Harvest],
    outStack: [Action.Back, Action.Fill, Action.Fuel, Action.Build, Action.Upgrade],
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
        delete creep.memory.sourceMark;
    }

    this.loop0(creep, creep.memory.hauling);
};

var mod = new RoleObj(C.KEEPER);
module.exports = mod;

mod.roleConfigControllerContainerIsEmpty = {
    inStack: [Action.FromLink, Action.FromStorage, Action.FromTerminal],
    outStack: [Action.PutForUpgrade],
};

mod.roleConfigBalance = {
    inStack: [Action.FromLink, Action.FromTerminal],
    outStack: [Action.PutToStorage],
};

mod.roleConfigUrgent = {
    inStack: [Action.Pickup, Action.FromLink],
    outStack: [Action.PutToTerminal, Action.Help],
};

mod.roleConfigNormal = {
    inStack: [Action.FromLink],
    outStack: [Action.PutToStorage, Action.PutToTerminal, Action.Help],
};

mod.loop = function(creep) {
    const controllerContainer = creep.room.controller.container;
    if(!creep.room.storage && creep.room.terminal) {
        //Pickup resources dropped from storage to terminal
        this.roleConfig = this.roleConfigUrgent;
    } else if(controllerContainer && controllerContainer.store[RESOURCE_ENERGY]===0) {
        //haul energy to controller container
        this.roleConfig = this.roleConfigControllerContainerIsEmpty;
    } else if(creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY]<Config.StorageReserveForEnergy) {
        //Move energy from terminal to storage
        this.roleConfig = this.roleConfigBalance;
    } else {
        //Redistribute energy from center link to storage/terminal
        this.roleConfig = this.roleConfigNormal;
    }

    if(creep.memory.hauling &&  _.sum(creep.carry) === 0) {
        creep.memory.hauling = false;
    }
    if(!creep.memory.hauling && _.sum(creep.carry) === creep.carryCapacity) {
        creep.memory.hauling = true;
    }

    this.loop0(creep, creep.memory.hauling);
};

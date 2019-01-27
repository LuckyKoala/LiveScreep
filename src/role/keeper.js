var mod = new RoleObj(C.KEEPER);
module.exports = mod;

mod.roleConfigNormal = {
    inStack: [Action.FromLink],
    outStack: [Action.PutForUpgrade, Action.Help, Action.Store],
};

mod.roleConfigControllerContainerIsEmpty = {
    inStack: [Action.FromLink, Action.FromStorage],
    outStack: [Action.PutForUpgrade, Action.Help, Action.Store],
};

mod.loop = function(creep) {
    const controllerContainer = creep.room.controller.container;
    if(controllerContainer && controllerContainer.store[RESOURCE_ENERGY]===0) {
        this.roleConfig = this.roleConfigControllerContainerIsEmpty;
    } else {
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

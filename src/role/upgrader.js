var mod = new RoleObj('Upgrader');
module.exports = mod;

mod.roleConfigWithContainer = {
    inStack: [],
    outStack: [Action.ComplexUpgrade],
};

mod.roleConfigWithoutContainer = {
    inStack: [Action.Withdraw, Action.Pickup],
    outStack: [Action.Upgrade],
};

mod.loop = function(creep) {
    if(creep.room.controller.container) {
        this.roleConfig = this.roleConfigWithContainer;
        this.loop0(creep, true);
    } else {
        this.roleConfig = this.roleConfigWithoutContainer;
        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
        }
        this.loop0(creep, !!creep.memory.upgrading);
    }
};

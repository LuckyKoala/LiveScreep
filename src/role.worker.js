var mod = new RoleObj('Worker');
module.exports = mod;

mod.roleConfig = {
    inStack: [Action.Harvest],
    outStack: [Action.Upgrade],
};

mod.loop = function(creep) {
    if(creep.room.controller.level > 3) {
        //Be a harvester if rcl is higher than 3
        creep.memory.role = 'harvester';
        return;
    }

    if(creep.memory.upgrading && creep.carry.energy == 0) {
        creep.memory.upgrading = false;
        creep.say('🔄 charge');
    }
    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
        creep.memory.upgrading = true;
        creep.say('⚡ upgrade');
    }

    this.loop0(creep, !!creep.memory.upgrading);
};

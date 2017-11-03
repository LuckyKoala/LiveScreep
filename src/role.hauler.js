var mod = new RoleObj('Hauler');
module.exports = mod;

mod.Setup = {
    Low: {
        minEnergy: 150,
        essBody: [CARRY, CARRY, MOVE],
        extraBody: [CARRY, CARRY, MOVE],
        maxExtraAmount: 2,
        prefix: '[LowHauler]',
        memory: {role: 'hauler'},
    },
    Normal: {
        minEnergy: 300,
        essBody: [WORK, CARRY, CARRY, CARRY, MOVE, MOVE],
        extraBody: [CARRY, CARRY, MOVE],
        maxExtraAmount: 3, //10Carry => 500Capacity is enough
        prefix: '[Hauler]',
        memory: {role: 'hauler'},
    },
};

mod.roleConfig = {
    inStack: [Action.Withdraw, Action.Pickup],
    outStack: [Action.Feed, Action.Fuel, Action.Put],
};

mod.loop = function(creep) {
    if(creep.getActiveBodyparts(WORK)>0) {
        //Fix road
        const structureOnTheGrounds = creep.pos.lookFor(LOOK_STRUCTURES);
        const roadsNeedRepair = _.filter(structureOnTheGrounds, o => {
            o.structureType==STRUCTURE_ROAD && o.hits<o.hitsMax
        });
        if(roadsNeedRepair.length) {
            creep.repair(roadsNeedRepair[0]);
        }
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

var mod = new RoleObj('Builder');
module.exports = mod;

mod.Setup = {
    Normal: {
		minEnergy: 200,
		essBody: [WORK, CARRY, MOVE],
		extraBody: [], //20 total energy, 10 for upgrade, 5 for spawn, 5 remain, 5/BUILD_POWER = 1 => 1xWORK
		//extraBody: [WORK, CARRY, MOVE],
		prefix: '[Builder]',
		memory: {role: 'builder'},
	},
};

mod.roleConfig = {
    inStack: [Action.Withdraw, Action.Pickup],
    outStack: [Action.Build, Action.Repair, Action.Maintain],
};

mod.loop = function(creep) {
	if(creep.memory.building && creep.carry.energy == 0) {
		creep.memory.building = false;
		creep.say('🔄 harvest');
	}
	if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
		creep.memory.building = true;
		creep.say('🚧 build');
	}

	this.loop0(creep, creep.memory.building);
};
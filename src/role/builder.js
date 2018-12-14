var mod = new RoleObj('Builder');
module.exports = mod;

mod.roleConfig = {
    inStack: [Action.Dismantle, Action.Withdraw, Action.Pickup],
    outStack: [Action.Build, Action.Maintain, Action.Repair],
};

mod.loop = function(creep) {
	if(creep.memory.building && creep.carry.energy == 0) {
		creep.memory.building = false;
	}
	if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
		creep.memory.building = true;
	}

	this.loop0(creep, creep.memory.building);
};

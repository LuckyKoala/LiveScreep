var mod = new RoleObj('Builder');
module.exports = mod;

mod.roleConfig = {
    inStack: [Action.Harvest],
    outStack: [Action.Build],
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

	if(creep.memory.building) {
		var action = this.roleConfig.outStack[0];
        action.loop(creep);
	}
	else {
		var action = this.roleConfig.inStack[0];
        action.loop(creep);
	}
};
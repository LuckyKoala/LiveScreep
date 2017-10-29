var mod = new RoleObj('Builder');
module.exports = mod;

mod.roleConfig = {
    inStack: [Task.Harvest],
    outStack: [Task.Build],
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
		var task = this.roleConfig.outStack[0];
        task.loop(creep);
	}
	else {
		var task = this.roleConfig.inStack[0];
        task.loop(creep);
	}
};
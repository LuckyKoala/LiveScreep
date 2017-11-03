var mod = new RoleObj('Ant');
module.exports = mod;

mod.Setup = {
    Normal: {
		minEnergy: 100,
		essBody: [CARRY, MOVE],
		extraBody: [],
		prefix: '[Ant]',
		memory: {role: 'ant'},
	},
};

mod.roleConfig = {
    inStack: [Action.Pickup],
    outStack: [Action.Put],
};
//TODO ant can stay near spawn to collect dropped energy while other creep being recycled
mod.loop = function(creep) {
	if(creep.memory.controlledByTask) {
		//Behaviour will be control by smalltask
	} else {
		this.loop0(creep, creep.carry.energy == creep.carryCapacity);
	}
};
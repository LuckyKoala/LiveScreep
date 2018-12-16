var mod = new RoleObj('Ant');
module.exports = mod;

mod.roleConfig = {
    inStack: [Action.Pickup],
    outStack: [Action.Put],
};

mod.loop = function(creep) {
	if(creep.memory.controlledByTask) {
		//Behaviour will be control by smalltask
	} else {
		this.loop0(creep, creep.carry.energy == creep.carryCapacity);
	}
};

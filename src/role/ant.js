var mod = new RoleObj('Ant');
module.exports = mod;

mod.roleConfig = {
    inStack: [],
    outStack: [],
};

mod.loop = function(creep) {
	  if(creep.memory.controlledByTask) {
		    //Behaviour will be control by smalltask
	  }
};

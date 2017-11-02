var mod = new RoleObj('Ant');
module.exports = mod;

mod.Setup = {
    Normal: {
		minEnergy: 50,
		essBody: [MOVE],
		extraBody: [],
		prefix: '[Ant]',
		memory: {role: 'ant'},
	},
};

mod.loop = function(creep) {
    //Behaviour will be control by smalltask
};
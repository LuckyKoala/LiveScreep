var mod = new SetupObj('Task');
module.exports = mod;

mod.setupConfig = {
    Normal: {
		minEnergy: 100,
		essBody: [CARRY, MOVE],
		extraBody: [],
		prefix: '[Ant]',
		memory: {role: 'Ant'},
	},
};

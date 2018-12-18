var mod = new SetupObj('Ant');
module.exports = mod;

mod.setupConfig = {
    Normal: {
		minEnergy: 100,
		essBody: [CARRY, MOVE],
		extraBody: [],
		prefix: '[Ant]',
		memory: {role: 'ant'},
	},
};

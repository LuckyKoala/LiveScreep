var mod = new SetupObj('Ant');
module.exports = mod;

mod.setupConfig = {
    Normal: {
		minEnergy: 50,
		essBody: [MOVE],
		extraBody: [],
		prefix: '[Ant]',
		memory: {role: 'ant'},
	},
};

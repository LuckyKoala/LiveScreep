var mod = new SetupObj('Scout');
module.exports = mod;

mod.setupConfig = {
    Normal: {
		minEnergy: 50,
		essBody: [MOVE],
		extraBody: [],
		prefix: '[Scout]',
		memory: {role: 'Scout'},
	},
};

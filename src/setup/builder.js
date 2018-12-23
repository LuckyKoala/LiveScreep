var mod = new SetupObj('Builder');
module.exports = mod;

mod.setupConfig = {
    Low: {
		    minEnergy: 250,
		    essBody: [WORK, CARRY, CARRY, MOVE],
		    extraBody: [],
		    prefix: '[LowBuilder]',
		    memory: {role: 'Builder'},
	  },
    Normal: {
		    minEnergy: 550,
		    essBody: [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
		    extraBody: [],
		    prefix: '[Builder]',
		    memory: {role: 'Builder'},
	  },
};

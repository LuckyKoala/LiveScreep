var mod = new SetupObj(C.BUILDER);
module.exports = mod;

mod.setupConfig = {
    Low: {
		    minEnergy: 250,
		    essBody: [WORK, CARRY, CARRY, MOVE],
		    extraBody: [],
		    prefix: `[Low-${C.BUILDER}]`,
		    memory: {role: C.BUILDER},
	  },
    Normal: {
		    minEnergy: 550,
		    essBody: [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
		    extraBody: [],
		    prefix: `[${C.BUILDER}]`,
		    memory: {role: C.BUILDER},
	  },
};

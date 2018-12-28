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
		    minEnergy: 400,
		    essBody: [CARRY, CARRY, MOVE, WORK, WORK, MOVE],
		    extraBody: [CARRY, WORK, MOVE],
        maxExtraAmount: 4,
		    prefix: `[${C.BUILDER}]`,
		    memory: {role: C.BUILDER},
	  },
};

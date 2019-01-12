var mod = new SetupObj(C.WORKER);
module.exports = mod;

mod.setupConfig = {
    Normal: {
		    minEnergy: 300,
		    essBody: [CARRY, CARRY, MOVE, WORK, MOVE],
		    extraBody: [CARRY, CARRY, MOVE, WORK, MOVE],
        maxExtraAmount: 1,
		    prefix: `[${C.WORKER}]`,
		    memory: {role: C.WORKER},
	  },
};

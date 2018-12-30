var mod = new SetupObj(C.REMOTE_WORKER);
module.exports = mod;

mod.setupConfig = {
    Normal: {
		    minEnergy: 200,
		    essBody: [CARRY, WORK, MOVE],
		    extraBody: [CARRY, WORK, MOVE],
        maxExtraAmount: 4,
		    prefix: `[${C.REMOTE_WORKER}]`,
		    memory: {role: C.REMOTE_WORKER},
	  },
};

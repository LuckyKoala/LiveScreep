var mod = new SetupObj(C.CLAIMER);
module.exports = mod;

mod.setupConfig = {
    Normal: {
		    minEnergy: 700,
		    essBody: [CLAIM, MOVE, MOVE],
		    extraBody: [],
        maxExtraAmount: 0,
		    prefix: `[${C.CLAIMER}]`,
		    memory: {role: C.CLAIMER},
	  },
};

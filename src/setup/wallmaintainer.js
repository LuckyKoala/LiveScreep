var mod = new SetupObj(C.WALLMAINTAINER);
module.exports = mod;

mod.setupConfig = {
    Low: {
		    minEnergy: 300,
		    essBody: [WORK, WORK, CARRY, MOVE],
		    extraBody: [],
		    prefix: `[Low-${C.WALLMAINTAINER}]`,
		    memory: {role: C.WALLMAINTAINER},
	  },
    Normal: {
		    minEnergy: 400,
		    essBody: [WORK, WORK, WORK, CARRY, MOVE],
		    extraBody: [WORK, WORK, WORK, CARRY, MOVE],
            maxExtraAmount: 9,
		    prefix: `[${C.WALLMAINTAINER}]`,
		    memory: {role: C.WALLMAINTAINER},
	  }
};

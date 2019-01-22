var mod = new SetupObj(C.WALLMAINTAINER);
module.exports = mod;

mod.setupConfig = {
    Low: {
		    minEnergy: 250,
		    essBody: [WORK, CARRY, CARRY, MOVE],
		    extraBody: [],
		    prefix: `[Low-${C.WALLMAINTAINER}]`,
		    memory: {role: C.WALLMAINTAINER},
	  },
    Normal: {
		    minEnergy: 400,
		    essBody: [CARRY, CARRY, MOVE, WORK, WORK, MOVE],
		    extraBody: [CARRY, WORK, MOVE],
            maxExtraAmount: 3,
		    prefix: `[${C.WALLMAINTAINER}]`,
		    memory: {role: C.WALLMAINTAINER},
	  },
    High: {
		    minEnergy: 400,
		    essBody: [CARRY, CARRY, MOVE, WORK, WORK, MOVE],
		    extraBody: [CARRY, WORK, MOVE],
        maxExtraAmount: 14,
		    prefix: `[${C.WALLMAINTAINER}]`,
		    memory: {role: C.WALLMAINTAINER},
	  },
};

mod.shouldUseHighLevel = function(room) {
    return room.controller.level === 8;
};

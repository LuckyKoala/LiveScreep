var mod = new SetupObj(C.SCOUT);
module.exports = mod;

mod.setupConfig = {
    Normal: {
		minEnergy: 50,
		essBody: [MOVE],
		extraBody: [],
		prefix: `[${C.SCOUT}]`,
		memory: {role: C.SCOUT},
	},
};

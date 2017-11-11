var mod = new SetupObj('Task');
module.exports = mod;

mod.setupConfig = {
    Normal: {
		minEnergy: 100,
		essBody: [CARRY, MOVE],
		extraBody: [],
		prefix: '[Ant]',
		memory: {role: 'ant'},
	},
};

mod.shouldSpawn = function(room, cnt) {
    //Find available task
    //Get override setupConfig and shouldSpawn of task
    return false;
};
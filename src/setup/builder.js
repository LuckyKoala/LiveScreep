var mod = new SetupObj('Builder');
module.exports = mod;

mod.setupConfig = {
    Low: {
		minEnergy: 250,
		essBody: [WORK, CARRY, CARRY, MOVE],
		extraBody: [],
		prefix: '[LowBuilder]',
		memory: {role: 'builder'},
	},
    Normal: {
		minEnergy: 550,
		essBody: [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
		extraBody: [],
		prefix: '[Builder]',
		memory: {role: 'builder'},
	},
};

mod.shouldSpawn = function(room, cnt) {
	const cntLimit = room.energyCapacityAvailable < 550 ? 2 : 1; //2 work or 2 work
    const existCount = cnt[lowerFirst(this.setupName)];
    const needBuildStructures = room.find(FIND_CONSTRUCTION_SITES);
    const needRepairStructures = room.find(FIND_STRUCTURES, {
        filter: function(o) {
            return o.hits < o.hitsMax;
        }
    });
    const needBuilder = (needBuildStructures.length + needRepairStructures.length) > 0;
    return needBuilder && (_.isUndefined(existCount) || existCount < cntLimit);
};
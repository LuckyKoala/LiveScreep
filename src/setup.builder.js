var mod = new SetupObj('Builder');
module.exports = mod;

mod.setupConfig = {
    Normal: {
		minEnergy: 200,
		essBody: [WORK, CARRY, MOVE],
		extraBody: [WORK, WORK, MOVE],
		maxExtraAmount: 1,
		prefix: '[Builder]',
		memory: {role: 'builder'},
	},
};

mod.shouldSpawn = function(room, cnt) {
    const existCount = cnt[lowerFirst(this.setupName)];
    const needBuildStructures = room.find(FIND_CONSTRUCTION_SITES);
    const needRepairStructures = room.find(FIND_STRUCTURES, {
        filter: function(o) {
            return o.hits < o.hitsMax;
        }
    });
    const needBuilder = (needBuildStructures.length + needRepairStructures.length) > 0;
    return needBuilder && (_.isUndefined(existCount) || existCount < 1);
};
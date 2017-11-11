module.exports = {
    setupConfig: {
        Normal: {
            minEnergy: 130,
            essBody: [ATTACK, MOVE],
            extraBody: [ATTACK, TOUGH, MOVE],
            maxExtraAmount: 2,
            prefix: '[Guardian]',
            memory: {role: 'guardian'},
        },
    },
    shouldSpawn: function(room, cnt) {
        //Find available task
        //Get override setupConfig and shouldSpawn of task
        return true;
    },
}
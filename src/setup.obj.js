/**
 * the minEnergy+bodyCost(extraBody*maxExtraAmount) in setup.Low
 *   must be low than the minEnergy in setup.Normal
 */

var mod = function(name) {
    this.setupName = name;
    this.setupConfig = {
        Normal: {
            minEnergy: 100,
            essBody: [CARRY, MOVE],
            extraBody: [],
            prefix: '[Ant]',
            memory: {role: 'ant'},
        },
    };
    this.shouldSpawn = function(room, cnt) {
        return false;
    };
    this.shouldUseHighLevel = function() {
        return false;
    }
};

module.exports = mod;
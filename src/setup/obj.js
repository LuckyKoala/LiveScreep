/**
 * the minEnergy+bodyCost(extraBody*maxExtraAmount) in setup.Low
 *   must be low than the minEnergy in setup.Normal
 */

var mod = function(name) {
    this.setupName = name;
    //K: road 0.5 ; plain 1 ; swamp 5
    //Fatigue = 2*(Weight * K - Move)
    // each move part decease fatigue by 2 per tick
    this.setupConfig = {
        Normal: {
            minEnergy: 100,
            essBody: [CARRY, MOVE],
            extraBody: [],
            prefix: '[Ant]',
            memory: {role: 'Ant'},
        },
    };
    this.shouldUseHighLevel = function() {
        return false;
    };
    this.prespawn = 5;
    //this.dynamicExtraAmount = function() {};
};

module.exports = mod;

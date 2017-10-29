var mod = function(name) {
    this.taskName = name;
    this.nextTarget = function() {
        return false;
    };
    this.loop = function(creep) {
        this.creep = creep;
        //Find target
        var target = nextTarget();
        //Action
        console.log(target);
    };
};

module.exports = mod;
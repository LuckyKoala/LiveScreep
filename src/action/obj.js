var mod = function(name) {
    this.actionName = name;
    this.nextTarget = function() {
        return false;
    };
    this.word = 'Nil';
    //Util function
    //False means this action can't process
    this.loop0 = function(creep, actionFunc) {
        creep.say(this.word);
        this.creep = creep;
        var target = this.nextTarget();
        if(target) {
            actionFunc(creep, target);
            return true;
        } else {
            return false;
        }
    };
    //Default behaviour
    this.loop = function(creep) {
        return this.loop0(creep, (creep, target) => {
            //Do nothing
        });
    };
};

module.exports = mod;

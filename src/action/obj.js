var mod = function(name) {
    this.actionName = name;
    this.nextTarget = function() {
        return false;
    };
    this.word = 'Nil';
    //Util function
    //False means this action can't process
    this.loop0 = function(creep, actionFunc) {
        this.creep = creep;
        const target = this.nextTarget();
        if(target) {
            actionFunc(creep, target);
            creep.say(this.word);
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

var mod = function(name) {
    this.roleName = name;
    this.roleConfig = {
        inStack: [],
        outStack: [],
    };
    //Util function
    this.loop0 = function(creep, useOut) {
        if(useOut) {
            var stack = this.roleConfig.outStack;
            for(var i=0; i<stack.length; i++) {
                var action = stackj[i];
                action.loop(creep);
            }
        }
        else {
            var stack = this.roleConfig.inStack;
            for(var i=0; i<stack.length; i++) {
                var action = stackj[i];
                action.loop(creep);
            }
        }
    };
    //Default behaviour, can be override
    this.loop = function(creep) {
        this.loop0(creep, creep.carry.energy >= creep.carryCapacity);
    };
};

module.exports = mod;
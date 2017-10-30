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
            //If can't process previous action then invoke next
            for(var i=0; i<stack.length; i++) {
                if(stack[i].loop(creep)) break;
            }
        }
        else {
            var stack = this.roleConfig.inStack;
            for(var i=0; i<stack.length; i++) {
                if(stack[i].loop(creep)) break;
            }
        }
    };
    //Default behaviour, can be override
    this.loop = function(creep) {
        //What if there is no carry part?
        this.loop0(creep, creep.carry.energy >= creep.carryCapacity);
    };
};

module.exports = mod;
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
        //Check active carry part
        var useOut = creep.getActiveBodyparts(CARRY) == 0 ? false : creep.carry.energy >= creep.carryCapacity;
        this.loop0(creep, useOut);
    };
};

module.exports = mod;
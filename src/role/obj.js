var mod = function(name) {
    this.roleName = name;
    this.roleConfig = {
        inStack: [],
        outStack: [],
    };
    //Util function
    this.loop0 = function(creep, useOut) {
        if(useOut) {
            const stack = this.roleConfig.outStack;
            //If can't process previous action then invoke next
            for(let i=0; i<stack.length; i++) {
                if(stack[i].loop(creep)) break;
            }
        }
        else {
            const stack = this.roleConfig.inStack;
            for(let i=0; i<stack.length; i++) {
                if(stack[i].loop(creep)) break;
            }
        }
    };
    //Default behaviour, can be override
    this.loop = function(creep) {
        //Check active carry part
        const useOut = creep.getActiveBodyparts(CARRY) == 0 ? false : _.sum(creep.carry) == creep.carryCapacity;
        this.loop0(creep, useOut);
    };
};

module.exports = mod;

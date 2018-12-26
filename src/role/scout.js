var mod = new RoleObj(C.SCOUT);
module.exports = mod;

mod.roleConfig = {
    inStack: [],
    //Stay in target room to provide vision
    outStack: [Action.Travel],
};

mod.loop = function(creep) {
    this.loop0(creep, true);
};

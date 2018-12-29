var mod = new RoleObj(C.CLAIMER);
module.exports = mod;

mod.roleConfig= {
    inStack: [Action.Travel, Action.Claim],
    outStack: [],
};

mod.loop = function(creep) {
	  this.loop0(creep, false);
};

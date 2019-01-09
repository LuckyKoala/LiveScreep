var mod = new RoleObj(C.PIONEER);
module.exports = mod;

mod.roleConfig= {
    inStack: [Action.Travel, Action.Renew, Action.Pickup, Action.Withdraw, Action.Harvest],
    outStack: [Action.Renew, Action.Build, Action.Upgrade],
};

mod.loop = function(creep) {
	  if(creep.memory.building && creep.carry.energy == 0) {
		    creep.memory.building = false;
	  }
	  if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
		    creep.memory.building = true;
        Util.SourceMark.clearSourceMark(creep);
	  }

	  this.loop0(creep, creep.memory.building);
};

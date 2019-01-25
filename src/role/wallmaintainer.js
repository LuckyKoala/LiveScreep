var mod = new RoleObj(C.WALLMAINTAINER);
module.exports = mod;

mod.roleConfig= {
    inStack: [Action.Back, Action.Dismantle, Action.FromStorage, Action.Pickup],
    outStack: [Action.Maintain, Action.Fortify],
};

mod.loop = function(creep) {
	  if(creep.memory.building && creep.carry.energy == 0) {
		    creep.memory.building = false;
	  }
	  if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
		    creep.memory.building = true;
	  }

	  this.loop0(creep, creep.memory.building);
};

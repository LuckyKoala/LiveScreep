var mod = new RoleObj(C.BUILDER);
module.exports = mod;

mod.roleConfig= {
    inStack: [Action.Back, Action.Dismantle, Action.FromStorage, Action.Pickup],
    //Maintain ramparts first since it will decay and it is a structure for defense
    // then repair hurt structures,roads and walls
    // build structures at last since it can wait
    outStack: [Action.Build, Action.Maintain, Action.Repair, Action.Travel],
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

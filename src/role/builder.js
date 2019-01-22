var mod = new RoleObj(C.BUILDER);
module.exports = mod;

mod.roleConfigOutsideHome = {
    inStack: [Action.Dismantle, Action.Pickup, Action.Back, Action.FromStorage],
    outStack: [Action.Build, Action.Repair, Action.Travel, Action.Drop], //not going home, then builder muse be doing action.dismantle, just drop energy on the ground so it can keep dismantling.
};

mod.roleConfigInHome = {
    inStack: [Action.FromStorage, Action.Dismantle, Action.Pickup],
    //Maintain ramparts first since it will decay and it is a structure for defense
    // then repair hurt structures,roads and walls
    // build structures at last since it can wait
    outStack: [Action.Build, Action.Maintain, Action.Repair, Action.Travel],
};

mod.loop = function(creep) {
    if(creep.memory.homeRoom === creep.room.name) {
        this.roleConfig = this.roleConfigInHome;
    } else {
        this.roleConfig = this.roleConfigOutsideHome;
    }

	  if(creep.memory.building && creep.carry.energy == 0) {
		    creep.memory.building = false;
	  }
	  if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
		    creep.memory.building = true;
	  }

	  this.loop0(creep, creep.memory.building);
};

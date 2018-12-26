var mod = new RoleObj(C.REMOTE_HARVESTER);
module.exports = mod;

mod.roleConfig = {
    //make sure creep is in target room
    inStack: [Action.Travel, Action.Harvest],
    //aka container-mining and drop-mining
    outStack: [Action.Put, Action.Drop],
};

mod.loop = function(creep) {
    const useOut = creep.getActiveBodyparts(CARRY) == 0 ? false : _.sum(creep.carry) ===  creep.carryCapacity;
    this.loop0(creep, useOut);
};

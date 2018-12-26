var mod = new RoleObj(C.HARVESTER);
module.exports = mod;

mod.roleConfig = {
    inStack: [Action.Harvest],
    //aka link-mining, container-mining and drop-mining
    outStack: [Action.PutToLink, Action.Put, Action.Drop],
};

mod.loop = function(creep) {
    const useOut = creep.getActiveBodyparts(CARRY) == 0 ? false : _.sum(creep.carry) ===  creep.carryCapacity;
    this.loop0(creep, useOut);
};

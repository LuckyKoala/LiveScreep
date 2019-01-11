var mod = new RoleObj(C.UPGRADER);
module.exports = mod;

mod.roleConfig = {
    inStack: [Action.FromLink, Action.FromContainer],
    outStack: [Action.Sign, Action.Upgrade],
};

mod.loop = function(creep) {
    const energyPerAction = UPGRADE_CONTROLLER_POWER*creep.getActiveBodyparts(WORK);
    const energyRemainNextTick = creep.carry.energy - energyPerAction;
    const energyEnoughForAction = energyRemainNextTick >= 0;

    this.loop0(creep, energyEnoughForAction);
};

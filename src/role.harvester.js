var mod = new RoleObj('Harvester');
module.exports = mod;

mod.roleConfig = {
    inStack: [Action.Harvest],
    outStack: [Action.Put, Action.Drop], //Only be used when harvester has active carry part
};

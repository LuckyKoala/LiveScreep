var mod = new RoleObj('Harvester');
module.exports = mod;

mod.roleConfig = {
    inStack: [Action.Harvest],
    //aka link-mining, container-mining and drop-mining
    outStack: [Action.PutToLink, Action.Put, Action.Drop],
};

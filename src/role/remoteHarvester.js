var mod = new RoleObj('RemoteHarvester');
module.exports = mod;

mod.roleConfig = {
    //make sure creep is in target room
    inStack: [Action.Travel, Action.Harvest],
    //aka container-mining and drop-mining
    outStack: [Action.Put, Action.Drop],
};

var mod = new RoleObj(C.MINER);
module.exports = mod;

mod.roleConfig = {
    inStack: [Action.Mine],
    //no carry part, so mineral resource will drop natually
    //aka container-mining(if miner is stand above container) and drop-mining
    outStack: [],
};

mod.loop = function(creep) {
    this.loop0(creep, false);
};

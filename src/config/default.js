var mod = {
    EnableProfiler: false,
    StorageBoundForSpawn: 15*Thousand,
    StorageBoundForSpawnRecovery: 10*Thousand,
    StorageBoundForAddUpgrader: 50*Thousand,
    StorageBoundForWallMaintainer: 60*Thousand,
    RampartMaintainThreshold: {
        //this value shouldn't be too high since it is used by getRampartSitesCanBuild(),
        //  if it is too high, then rampart site can only be built by bigger builder which
        //  have many limitation.
        Lowest: 10*Thousand,
        Low: 60*Thousand,
        Normal: 120*Thousand,
    },
    WallMaxHits: 30*Thousand*Thousand,
    EnergyForDefend: 600,
    SellExtraResourceBound: 10*Thousand
};
module.exports = mod;

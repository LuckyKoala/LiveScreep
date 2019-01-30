var mod = {
    EnableProfiler: false,
    StorageBoundForSpawnRecovery: 10*Thousand,
    StorageBoundForSpawn: 15*Thousand,
    StorageBoundForGuardian: 18*Thousand,
    StorageBoundForAddUpgrader: 50*Thousand,
    StorageBoundForPlaceHighLevelStructures: 60*Thousand,
    StorageBoundForWallMaintainer: 80*Thousand,
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
    SellExtraResourceBound: 10*Thousand,
    RebuildStructures: true,
    TerminalHelpRoomDistanceMax: 10,
    TerminalHelpEnergyMin: 10*Thousand,
    //Storage store configuration
    StorageReserveForEnergy: 233*Thousand
};
module.exports = mod;

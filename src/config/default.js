var mod = {
    EnableProfiler: false,
    StorageBoundForAddUpgrader: 60*Thousand,
    RampartMaintainThreshold: {
        //this value shouldn't be too high since it is used by getRampartSitesCanBuild(),
        //  if it is too high, then rampart site can only be built by bigger builder which
        //  have many limitation.
        Lowest: 10*Thousand,
        Low: 60*Thousand,
        Normal: 150*Thousand,
    },
    EnergyForDefend: 600,
};
module.exports = mod;
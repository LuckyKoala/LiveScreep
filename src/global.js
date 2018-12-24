global.Thousand = 1000; //For readability of number literals in code

global.tryRequire = (path, silent = false) => {
    let mod;
    try{
        mod = require(path);
    } catch(e) {
        if( e.message && e.message.indexOf('Unknown module') > -1 ){
            if(!silent) console.log(`Module "${path}" not found!`);
        } else if(mod == null) {
            console.log(`Error loading module "${path}"!<br/>${e.stack || e.toString()}`);
        }
        mod = null;
    }
    return mod;
};

global.CONSTANTS = {
    USERNAME: 'Lucky777777',
    OWNED_ROOM: 'owned room',
    EXTERNAL_ROOM: 'external room',
    HIGH_WAY: 'high way',
    CENTER_ROOM: 'center room',
    KEEPER_ROOM: 'keeper room'
};

global.cli = require('util_cli');

const DefaultConfig = require('config_default');
const OverrideConfig = tryRequire('config_override', true) || {};
global.Config = _.defaultsDeep(OverrideConfig, DefaultConfig);

global.RoleObj = require('role_obj');
global.ActionObj = require('action_obj');
global.SetupObj = require('setup_obj');
global.FlagUtil = {
    dismantle: {
        color: COLOR_RED,
        secondaryColor: COLOR_RED,
    },
    guard: {
        color: COLOR_BLUE,
        secondaryColor: COLOR_BLUE,
    },
    remoteMining: {
        color: COLOR_WHITE,
        secondaryColor: COLOR_WHITE,
    },
};
function makeExamineFunction(constant) {
    return o => o.color==constant.color && o.secondaryColor==constant.secondaryColor;
};
function addExamineToFlagUtil() {
    _.forEach(FlagUtil, o => o.examine = makeExamineFunction(o));
}
addExamineToFlagUtil();

global.Action = {
    Harvest: require('action_harvest'),
    Fill: require('action_fill'),
    Idle: require('action_idle'),
    Upgrade: require('action_upgrade'),
    ComplexUpgrade: require('action_complex_upgrade'),
    Build: require('action_build'),
    Withdraw: require('action_withdraw'),
    Put: require('action_put'),
    Store: require('action_store'),
    PutForUpgrade: require('action_putForUpgrade'),
    PutToLink: require('action_putToLink'),
    Fuel: require('action_fuel'),
    Guard: require('action_guard'),
    Pickup: require('action_pickup'),
    Drop: require('action_drop'),
    Maintain: require('action_maintain'),
    Repair: require('action_repair'),
    Recycle: require('action_recycle'),
    Dismantle: require('action_dismantle'),
    Invade: require('action_invade'),
    Travel: require('action_travel'),
    Back: require('action_back'),
    Reserve: require('action_reserve'),
};
global.Setup = {
    Worker: require('setup_worker'),
    Harvester: require('setup_harvester'),
    Upgrader: require('setup_upgrader'),
    Builder: require('setup_builder'),
    Hauler: require('setup_hauler'),
    Guardian: require('setup_guardian'),
    Ant: require('setup_ant'),
    Scout: require('setup_scout'),
    Filler: require('setup_filler'),
    Task: require('setup_task'),
    RemoteHarvester: require('setup_remoteHarvester'),
    RemoteHauler: require('setup_remoteHauler'),
    Reserver: require('setup_reserver'),
};
global.Role = {
    //Not used
    Worker: require('role_worker'),
    //Base roles
    Harvester: require('role_harvester'),
    Upgrader: require('role_upgrader'),
    Builder: require('role_builder'),
    Hauler: require('role_hauler'),
    Guardian: require('role_guardian'),
    //Not used
    Ant: require('role_ant'),
    //Recycle creep assigned
    Recycler: require('role_recycler'),
    //Redistribute energy in storage
    Filler: require('role_filler'),
    //Remote mining
    Scout: require('role_scout'),
    RemoteHarvester: require('role_remoteHarvester'),
    RemoteHauler: require('role_remoteHauler'),
    Reserver: require('role_reserver'),
};
global.Util = {
    Defense: require('util_defense'),
    Mark: require('util_mark'),
    SourceMark: require('util_sourcemark'),
    Smalltask: require('util_smalltask'),
    Stat: require('util_stat'),
    Helper: require('util_helper'),
};
global.State= {};

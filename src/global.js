global.Thousand = 1000; //For readability of number literals in code
global.lowerFirst = function(string) {
    return string && (string.charAt(0).toLowerCase() + string.slice(1));
};

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
}
function makeExamineFunction(constant) {
    return o => o.color==constant.color && o.secondaryColor==constant.secondaryColor;
};
function addExamineToFlagUtil() {
    _.forEach(FlagUtil, o => o.examine = makeExamineFunction(o));
}
addExamineToFlagUtil();

global.Action = {
    Harvest: require('action_harvest'),
    Feed: require('action_feed'),
    Upgrade: require('action_upgrade'),
    ComplexUpgrade: require('action_complex_upgrade'),
    Build: require('action_build'),
    Withdraw: require('action_withdraw'),
    Put: require('action_put'),
    Fuel: require('action_fuel'),
    Guard: require('action_guard'),
    Pickup: require('action_pickup'),
    Drop: require('action_drop'),
    Maintain: require('action_maintain'),
    Repair: require('action_repair'),
    Recycle: require('action_recycle'),
    Dismantle: require('action_dismantle'),
    Travel: require('action_travel'),
    Invade: require('action_invade'),
};
global.Setup = {
    Worker: require('setup_worker'),
    Harvester: require('setup_harvester'),
    Upgrader: require('setup_upgrader'),
    Builder: require('setup_builder'),
    Hauler: require('setup_hauler'),
    Guardian: require('setup_guardian'),
    Ant: require('setup_ant'),
    Filler: require('setup_filler'),
    Task: require('setup_task'),
};
global.Role = {
    Worker: require('role_worker'),
    Harvester: require('role_harvester'),
    Upgrader: require('role_upgrader'),
    Builder: require('role_builder'),
    Hauler: require('role_hauler'),
    Guardian: require('role_guardian'),
    Ant: require('role_ant'),
    Recycler: require('role_recycler'),
    Filler: require('role_filler'),
};
global.Util = {
    Defense: require('util_defense'),
    Mark: require('util_mark'),
    SourceMark: require('util_sourcemark'),
    GC: require('util_gc'),
    Smalltask: require('util_smalltask'),
    Stat: require('util_stat'),
}
global.State= {};
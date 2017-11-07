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

global.Config = tryRequire('config.override', true) || {};
global.RoleObj = require('role.obj');
global.ActionObj = require('action.obj');
global.SetupObj = require('setup.obj');
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
    Harvest: require('action.harvest'),
    Feed: require('action.feed'),
    Upgrade: require('action.upgrade'),
    ComplexUpgrade: require('action.complex.upgrade'),
    Build: require('action.build'),
    Withdraw: require('action.withdraw'),
    Put: require('action.put'),
    Fuel: require('action.fuel'),
    Guard: require('action.guard'),
    Pickup: require('action.pickup'),
    Drop: require('action.drop'),
    Maintain: require('action.maintain'),
    Repair: require('action.repair'),
    Recycle: require('action.recycle'),
    Dismantle: require('action.dismantle'),
    Travel: require('action.travel'),
};
global.Setup = {
    Worker: require('setup.worker'),
    Harvester: require('setup.harvester'),
    Upgrader: require('setup.upgrader'),
    Builder: require('setup.builder'),
    Hauler: require('setup.hauler'),
    Guardian: require('setup.guardian'),
    Ant: require('setup.ant'),
    Filler: require('setup.filler'),
};
global.Role = {
    Worker: require('role.worker'),
    Harvester: require('role.harvester'),
    Upgrader: require('role.upgrader'),
    Builder: require('role.builder'),
    Hauler: require('role.hauler'),
    Guardian: require('role.guardian'),
    Ant: require('role.ant'),
    Recycler: require('role.recycler'),
    Filler: require('role.filler'),
};
global.Util = {
    Tower: require('util.tower'),
    Defense: require('util.defense'),
    Mark: require('util.mark'),
    GC: require('util.gc'),
    Smalltask: require('util.smalltask'),
    Stat: require('util.stat'),
}
global.State= {};
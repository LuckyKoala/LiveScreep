global.Thousand = 1000; //For readability of number literals in code

global.tryRequire = (path, silent = false) => {
    let mod;
    try{
        mod = require(path);
    } catch(e) {
        if( e.message && e.message.indexOf('Unknown module') > -1 ){
            if(!silent) Logger.error(`Module "${path}" not found!`);
        } else if(mod == null) {
            Logger.error(`Error loading module "${path}"!<br/>${e.stack || e.toString()}`);
        }
        mod = null;
    }
    return mod;
};

global.C = {
    USERNAME: 'Lucky777777',
    SIGN_TEXT: 'A little mutation?',
    OWNED_ROOM: 'owned room',
    EXTERNAL_ROOM: 'external room',
    HIGH_WAY: 'high way',
    CENTER_ROOM: 'center room',
    KEEPER_ROOM: 'keeper room',
    STATE: {
        IDLE_CREEPS: 'idleCreeps'
    },
    /*
    ========================================
    harvest energy from source and haul it
    ========================================

    source ----------> container/ground --------> storage
            harvester                    hauler
                                        ----------------------> spawns/extensions
                                         hauler(if no storage)
                                         ----------------------> keeper
                                         hauler(if no storage)
                                         ----------------------> controllerContainer
                                         hauler(if no storage)
                       link --------> spawns/extensions
                             filler
                            --------> StructureController
                             upgrader

    ========================================
    if storage present, do this pattern
    ========================================
    storage --------> structures
             builder
            --------> spawns/extensions ------------> Creeps
             filler                      spawnCreep
            --------> towers -------------> RoomObjects
             keeper           towerAction
            --------> controllerContainer/upgrader ---------> StructureController
             keeper                                 upgrader

    ========================================
    if no storage, fall back to this pattern
    ========================================

    controllerContainer ----------> structures
                         builder

    so keeper redistribute energy from storage or self to towers/upgraders(its container if present)
    */
    //=== Base role ===
    WORKER: 'worker',
    HARVESTER: 'harvester',
    HAULER: 'hauler',
    UPGRADER: 'upgrader',
    BUILDER: 'builder',
    WALLMAINTAINER: 'wallmaintainer',
    FILLER: 'filler',
    KEEPER: 'keeper',
    MINER: 'miner',
    //=== Defense role ===
    GUARDIAN: 'guardian', //honour rampart and fight invaders
    //=== Special role ===
    RECYCLER: 'recycler', //drive creep to put resources into storage and let spawn recycle self
    //=== Multiroom role ===
    SCOUT: 'scout', //travel between rooms and provide vision of the room it stayed
    RESERVER: 'reserver', //go to target room and reserve controller in that room
    REMOTE_WORKER: 'Rworker', //go to target room, get energy and haul it back
    REMOTE_HARVESTER: 'Rharvester', //go to target room and be a miner in that room
    REMOTE_HAULER: 'Rhauler', //travel and haul energy between rooms
    CLAIMER: 'claimer', //go to target room and claim controller in that room
    PIONEER: 'pioneer', //go to target room, build a spawn and upgrade controller until RCL 3
};

global.cli = require('util_cli');

const DefaultConfig = require('config_default');
const OverrideConfig = tryRequire('config_override', true) || {};
global.Config = _.defaultsDeep(OverrideConfig, DefaultConfig);

global.RoleObj = require('role_obj');
global.ActionObj = require('action_obj');
global.SetupObj = require('setup_obj');
global.ColorMapper = ['NONE',
                      'COLOR_RED', 'COLOR_PURPLE', 'COLOR_BLUE', 'COLOR_CYAN',
                      'COLOR_GREEN', 'COLOR_YELLOW', 'COLOR_ORANGE', 'COLOR_BROWN',
                      'COLOR_GREY', 'COLOR_WHITE'];
//WHITE for top level task
//GREY for low level task
//BROWN for special use
//YELLOW for anchor
//RED for combat task
global.FlagUtil = {
    //=========Anchor=========
    bunkerAnchor: {
        color: COLOR_YELLOW,
        secondaryColor: COLOR_WHITE
    },
    //=========Top level=========
    // base is a combination of spawning, mining, building and upgrading
    base: {
        color: COLOR_WHITE,
        secondaryColor: COLOR_WHITE,
    },
    // outpost is a combination of spawning, mining
    //  once this task is finished, it will be convert to a base task
    outpost: {
        color: COLOR_WHITE,
        secondaryColor: COLOR_GREY,
    },
    remoteMining: {
        color: COLOR_WHITE,
        secondaryColor: COLOR_BROWN,
    },
    //=========Low level=========
    working: {
        color: COLOR_GREY,
        secondaryColor: COLOR_WHITE,
        parent: 'base',
    },
    spawning: {
        color: COLOR_GREY,
        secondaryColor: COLOR_GREY,
        parent: 'base',
    },
    mining: {
        color: COLOR_GREY,
        secondaryColor: COLOR_BROWN,
        parent: 'base',
    },
    building: {
        color: COLOR_GREY,
        secondaryColor: COLOR_ORANGE,
        parent: 'base',
    },
    upgrading: {
        color: COLOR_GREY,
        secondaryColor: COLOR_YELLOW,
        parent: 'base',
    },
    defending: {
        color: COLOR_ORANGE,
        secondaryColor: COLOR_GREEN,
        parent: 'base',
    },
    //=============================
    // create this, set its memory and convert it to useful task flag
    empty: {
        color: COLOR_BROWN,
        secondaryColor: COLOR_WHITE,
    },
    //Depreated not used!
    dismantle: {
        color: COLOR_RED,
        secondaryColor: COLOR_RED,
    },
    guard: {
        color: COLOR_BLUE,
        secondaryColor: COLOR_BLUE,
    },
};
(function() {
    function makeExamineFunc(constant) {
        return o => {
            //Check parent
            const parent= constant.parent;
            if(parent) {
                const parentFlag = FlagUtil[parent];
                if(parentFlag) {
                    return o.color===parentFlag.color && o.secondaryColor===parentFlag.secondaryColor;
                } else {
                    Logger.warning('Undefined parentFlag!');
                }
            }
            return o.color==constant.color && o.secondaryColor==constant.secondaryColor;
        };
    };
    function makeDescribeFunc(constant) {
        return () => [ColorMapper[constant.color], ColorMapper[constant.secondaryColor]];
    };
    _.forEach(FlagUtil, o => {
        o.examine = makeExamineFunc(o);
        o.describe = makeDescribeFunc(o);
    });
})();

global.Action = {
    Harvest: require('action_harvest'),
    Mine: require('action_mine'),
    Fill: require('action_fill'),
    Idle: require('action_idle'),
    Upgrade: require('action_upgrade'),
    Build: require('action_build'),
    FromContainer: require('action_fromContainer'),
    FromTombstone: require('action_fromTombstone'),
    FromStorage: require('action_fromStorage'),
    FromTerminal: require('action_fromTerminal'),
    FromLink: require('action_fromLink'),
    Put: require('action_put'),
    Help: require('action_help'),
    PutToStorage: require('action_putToStorage'),
    PutForUpgrade: require('action_putForUpgrade'),
    PutToLink: require('action_putToLink'),
    PutToTerminal: require('action_putToTerminal'),
    PutToKeeper: require('action_putToKeeper'),
    Fuel: require('action_fuel'),
    Guard: require('action_guard'),
    Pickup: require('action_pickup'),
    Drop: require('action_drop'),
    Maintain: require('action_maintain'),
    Fortify: require('action_fortify'),
    Repair: require('action_repair'),
    Recycle: require('action_recycle'),
    Dismantle: require('action_dismantle'),
    Invade: require('action_invade'),
    Travel: require('action_travel'),
    Back: require('action_back'),
    Reserve: require('action_reserve'),
    Heal: require('action_heal'),
    Claim: require('action_claim'),
    Sign: require('action_sign'),
    Renew: require('action_renew'),
};
global.Setup = {
    [C.WORKER]: require('setup_worker'),
    [C.HARVESTER]: require('setup_harvester'),
    [C.MINER]: require('setup_miner'),
    [C.UPGRADER]: require('setup_upgrader'),
    [C.BUILDER]: require('setup_builder'),
    [C.WALLMAINTAINER]: require('setup_wallmaintainer'),
    [C.HAULER]: require('setup_hauler'),
    [C.GUARDIAN]: require('setup_guardian'),
    [C.FILLER]: require('setup_filler'),
    [C.KEEPER]: require('setup_keeper'),
    [C.SCOUT]: require('setup_scout'),
    [C.REMOTE_WORKER]: require('setup_remoteWorker'),
    [C.REMOTE_HARVESTER]: require('setup_remoteHarvester'),
    [C.REMOTE_HAULER]: require('setup_remoteHauler'),
    [C.RESERVER]: require('setup_reserver'),
    [C.CLAIMER]: require('setup_claimer'),
    [C.PIONEER]: require('setup_pioneer'),
};

global.Role = {
    [C.WORKER]: require('role_worker'),
    [C.HARVESTER]: require('role_harvester'),
    [C.MINER]: require('role_miner'),
    [C.UPGRADER]: require('role_upgrader'),
    [C.BUILDER]: require('role_builder'),
    [C.WALLMAINTAINER]: require('role_wallmaintainer'),
    [C.HAULER]: require('role_hauler'),
    [C.GUARDIAN]: require('role_guardian'),
    [C.RECYCLER]: require('role_recycler'),
    [C.FILLER]: require('role_filler'),
    [C.KEEPER]: require('role_keeper'),
    [C.SCOUT]: require('role_scout'),
    [C.REMOTE_WORKER]: require('role_remoteWorker'),
    [C.REMOTE_HARVESTER]: require('role_remoteHarvester'),
    [C.REMOTE_HAULER]: require('role_remoteHauler'),
    [C.RESERVER]: require('role_reserver'),
    [C.CLAIMER]: require('role_claimer'),
    [C.PIONEER]: require('role_pioneer'),
};
global.Util = {
    Logger: require('util_logger'),
    Defense: require('util_defense'),
    Mark: require('util_mark'),
    SourceMark: require('util_sourcemark'),
    Smalltask: require('util_smalltask'),
    Stat: require('util_stat'),
    Helper: require('util_helper'),
    Movement: require('util_movement'),
    Observer: require('util_observer'),
};
//Shorthand
global.Logger = Util.Logger;
global.State= {};

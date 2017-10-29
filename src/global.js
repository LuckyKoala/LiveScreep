global.RoleObj = require('role.obj');
global.ActionObj = require('action.obj');
global.Action = {
    Harvest: require('action.harvest'),
    Feed: require('action.feed'),
    Upgrade: require('action.upgrade'),
    Build: require('action.build'),
    Withdraw: require('action.withdraw'),
    Put: require('action.put'),
};
global.Role = {
    Harvester: require('role.harvester'),
    Upgrader: require('role.upgrader'),
    Builder: require('role.builder'),
    Hauler: require('role.hauler'),
};
global.State= {};
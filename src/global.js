global.RoleObj = require('role.obj');
global.TaskObj = require('task.obj');
global.Task = {
    Harvest: require('task.harvest'),
    Feed: require('task.feed'),
    Upgrade: require('task.upgrade'),
    Build: require('task.build'),
    Withdraw: require('task.withdraw'),
};
global.Role = {
    Harvester: require('role.harvester'),
    Upgrader: require('role.upgrader'),
    Builder: require('role.builder'),
    Hauler: require('role.hauler'),
};
global.State= {};
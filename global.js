global.RoleObj = require('role.obj');
global.TaskObj = require('task.obj');
global.Task = {
    Harvest: require('task.harvest'),
    Feed: require('task.feed'),
    Upgrade: require('task.upgrade'),
    Build: require('task.build'),
};
global.Role = {
    Harvester: require('role.harvester'),
    Upgrader: require('role.upgrader'),
    Builder: require('role.builder'),
};
global.State= {};
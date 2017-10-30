global.RoleObj = require('role.obj');
global.ActionObj = require('action.obj');
global.Action = {
    Harvest: require('action.harvest'),
    Feed: require('action.feed'),
    Upgrade: require('action.upgrade'),
    Build: require('action.build'),
    Withdraw: require('action.withdraw'),
    Put: require('action.put'),
    Fuel: require('action.fuel'),
    Guard: require('action.guard'),
    Pickup: require('action.pickup'),
    Drop: require('action.drop'),
};
global.Role = {
    Harvester: require('role.harvester'),
    Upgrader: require('role.upgrader'),
    Builder: require('role.builder'),
    Hauler: require('role.hauler'),
    Guardian: require('role.guardian'),
};
global.Util = {
    Spawner: require('util.spawner'),
    Tower: require('util.tower'),
    War: require('util.war'),
    Mark: require('util.mark',)
}
global.State= {};
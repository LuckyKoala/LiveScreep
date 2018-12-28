const MiningTask = require('task_mining');
const SpawningTask = require('task_spawning');
const BuildingTask = require('task_building');
const UpgradingTask = require('task_upgrading');
const RemoteMiningTask = require('task_remoteMining');

var mod = {};
module.exports = mod;

//Run task to get spawn queue
mod.loop = function() {
    MiningTask.loop();
    SpawningTask.loop();
    BuildingTask.loop();
    UpgradingTask.loop();
    RemoteMiningTask.loop();
};

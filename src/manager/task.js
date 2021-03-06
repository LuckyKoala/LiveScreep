const MiningTask = require('task_mining');
const WorkingTask = require('task_working');
const SpawningTask = require('task_spawning');
const DefendingTask = require('task_defending');
const BuildingTask = require('task_building');
const UpgradingTask = require('task_upgrading');
const OutpostTask = require('task_outpost');
const RemoteMiningTask = require('task_remoteMining');

var mod = {};
module.exports = mod;

//Run task to get spawn queue
mod.loop = function() {
    MiningTask.loop();
    WorkingTask.loop();
    DefendingTask.loop();
    SpawningTask.loop();
    BuildingTask.loop();
    UpgradingTask.loop();
    OutpostTask.loop();
    RemoteMiningTask.loop();
};

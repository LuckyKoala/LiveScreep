const TaskObj = function(taskName) {
    this.taskName = taskName;
    //Memory Path: Memory.tasks[taskName];
    this.memoryOf = function(taskName) {
        if(_.isUndefined(Memory.tasks) || !_.isObject(Memory.tasks)) Memory.tasks={};
    };
}

module.exports = TaskObj;

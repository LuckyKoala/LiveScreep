module.exports = function(cmd, args) {
    //console.log(`$(cmd) $(args)`);
    if(cmd === 'roomPlan') {
        roomPlanCmdHandler(args);
    } else {
        notImplemented();
    }
};

function roomPlanCmdHandler(args) {
    //roomPlan on/off
    if(args && args.length===2) {
        const op = args[0];
        const roomName = args[1];
        if(op === 'on') {
            Memory.rooms[roomName].showRoomPlan = true;
        } else if(op === 'off') {
            Memory.rooms[roomName].showRoomPlan = false;
        }
    } else {
        wrongAmountOfArgs();
    }
};

function notImplemented() {
    console.log('command not implemented');
};

function wrongAmountOfArgs() {
    console.log('the amount of argument is not correct');
}

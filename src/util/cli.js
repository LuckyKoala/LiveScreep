module.exports = function(cmd, args) {
    //console.log(`$(cmd) $(args)`);
    if(cmd === 'roomPlan') {
        roomPlanCmdHandler(args);
    } else if(cmd === 'reset') {
        resetCmdHandler(args);
    } else {
        notImplemented();
    }
};

function resetCmdHandler(args) {
    if(args && args.length===1) {
        if(args[0]==='force') {
            for(let key in Memory) {
                delete Memory[key];
                console.log('Reset done.');
            }
        }
    } else {
        console.log('This command will reset Memory, use reset force if you are sure about this');
    }
}

function roomPlanCmdHandler(args) {
    if(args && args.length===2) {
        const op = args[0];
        const roomName = args[1];
        //roomPlan on/off
        if(op === 'on') {
            Memory.rooms[roomName].showRoomPlan = true;
        } else if(op === 'off') {
            Memory.rooms[roomName].showRoomPlan = false;
        } else if(op === 'reinit') {
            Memory.rooms[roomName].layout.init = false;
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

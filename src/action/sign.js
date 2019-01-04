let mod = new ActionObj('Sign');
module.exports = mod;

mod.nextTarget = function() {
    const creep =  this.creep;
    const controller = creep.room.controller;
    //Sign the controller!
    if(!controller.sign || controller.sign.username!==C.USERNAME) {
        return controller;
    } else {
        return false;
    }
};

mod.word = '🕵︎ Sign';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        if(ERR_NOT_IN_RANGE === creep.signController(target, C.SIGN_TEXT)) {
            creep.moveTo(target);
        }
    });
};

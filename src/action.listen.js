let mod = new ActionObj('Listen');
module.exports = mod;

//Should always be override

mod.nextTarget = function() {
    return false;
};

mod.loop = function(creep) {
    return false;
};
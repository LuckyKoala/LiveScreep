let mod = new ActionObj('Back');
module.exports = mod;

mod.nextTarget = function() {
    const creep = this.creep;
    if(creep.room.name === creep.memory.homeRoom) {
        return false;
    }

    const homeRoom = Game.rooms[creep.memory.homeRoom];
    return homeRoom.controller;
};

mod.word = '🕵︎ Back';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
    });
};

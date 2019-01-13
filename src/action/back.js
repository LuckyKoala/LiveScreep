let mod = new ActionObj('Back');
module.exports = mod;

mod.nextTarget = function() {
    const creep = this.creep;
    if(creep.room.name === creep.memory.homeRoom) {
        return false;
        /*
        const pos = creep.pos;
        if(pos.x === 0 || pos.x === 49 || pos.y === 0 || pos.y === 49) {
            //Don't stay at exit, creep will loop between room
            return creep.room.controller;
        } else {
            return false;
        }
        */
    }

    const homeRoom = Game.rooms[creep.memory.homeRoom];
    return homeRoom.controller;
};

mod.word = '🕵︎ Back';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        creep.moveTo(target, {
            reusePath: 15,
            visualizePathStyle: {stroke: '#ffffff'}
        });
    });
};

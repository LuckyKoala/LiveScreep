let mod = new ActionObj('Travel');
module.exports = mod;

mod.nextTarget = function() {
    const creep = this.creep;
    //Only support flag.
    if(creep.memory.destinedTarget) {
        const flag = Game.flags[creep.memory.destinedTarget];
        if(!flag) {
            console.log('Detect flag removed');
            creep.memory.role='Recycler';
            return false;
        }
        if(creep.room.name === flag.pos.roomName) {
            const pos = creep.pos;
            if(pos.x === 0 || pos.x === 49 || pos.y === 0 || pos.y === 49) {
                //Don't stay at exit, creep will loop between room
                return flag;
            } else {
                return false;
            }
        }
        return flag;
    }
    return false;
};

mod.word = '🕵︎ travel';

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        creep.moveTo(target, {
            reusePath: 15,
            visualizePathStyle: {stroke: '#ffffff'}
        });
    });
};

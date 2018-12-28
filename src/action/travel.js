let mod = new ActionObj('Travel');
module.exports = mod;

//Return false to mean creep is on the right room
mod.nextTarget = function() {
    const creep = this.creep;
    if(creep.memory.destinedTarget) {
        //we have a target
        const flag = Game.flags[creep.memory.destinedTarget];
        if(!flag) {
            console.log('Detect flag removed');
            creep.memory.role=C.RECYCLER;
            return false;
        }
        //If target room is under attack, do not go in
        const room = flag.room;
        if(room && room.memory.underAttack && creep.room.name!==creep.memory.homeRoom) {
            return Game.rooms[creep.memory.homeRoom].controller;
        }
        //We have reached target room, let's do some check
        if(creep.room.name === flag.pos.roomName) {
            const pos = creep.pos;
            if(pos.x === 0 || pos.x === 49 || pos.y === 0 || pos.y === 49) {
                //Don't stay at exit, creep will loop between room
                return flag;
            } else {
                return false;
            }
        }
        //Otherwise, go to target room
        return flag;
    } else {
        //we have no target
        // so we may be wrong room
        if(creep.room.name === creep.memory.homeRoom) {
            delete creep.memory.wrongRoomCounter;
            return false;
        }
        const home = Game.rooms[creep.memory.homeRoom];
        if(home) {
            const wrongRoomCounter = creep.memory.wrongRoomCounter || 0;
            //Creep can stay in wrong room at most 6 ticks in case it is finding path
            if(wrongRoomCounter > 6) {
                //Go home boy!
                console.log(`Creep ${creep.name} is going home!`);
                //Remove targets which may be in wrong room
                delete creep.memory.targetMark;
                return home.controller;
            } else {
                creep.memory.wrongRoomCounter = wrongRoomCounter+1;
                return false;
            }
        } else {
            console.log('no home!');
            return false; // let creep stay at this room since it has no home!
        }
    }
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

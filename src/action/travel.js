let mod = new ActionObj('Travel');
module.exports = mod;

//Return false to mean creep is on the right room
mod.nextTarget = function() {
    const creep = this.creep;
    if(creep.memory.destinedTarget) {
        //we have a target
        const flag = Game.flags[creep.memory.destinedTarget];
        if(!flag && creep.memory.role!==C.BUILDER) {
            console.log('Detect flag removed');
            creep.memory.role=C.RECYCLER;
            return false;
        }
        //If target room is under attack, do not go in
        const roomName = flag.pos.roomName;
        //Flee without vision is possible since we have memory!
        if(Memory.rooms[roomName] && creep.memory.role!==C.REMOTE_GUARDIAN && Memory.rooms[roomName].underAttack) {
            return Game.rooms[creep.memory.homeRoom].controller;
        }
        //We have reached target room, let's do some check
        if(creep.room.name === flag.pos.roomName) {
            const pos = creep.pos;
            //RemoteGuardian have a fixed target which is task flag,
            // so there is no need to let guardian away from exit.
            //What if we treat it as same as other creeps?
            // when invaders is near exit, it will stuck between exits of two rooms.
            if(creep.memory.role===C.REMOTE_GUARDIAN) return false;
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
        const home = Game.rooms[creep.memory.homeRoom];
        if(home) {
            const wrongRoomCounter = creep.memory.wrongRoomCounter || 0;
            //Right room but has been wrong room.
            if(creep.room.name === creep.memory.homeRoom) {
                if(wrongRoomCounter>0) {
                    const pos = creep.pos;
                    if(pos.x === 0 || pos.x === 49 || pos.y === 0 || pos.y === 49) {
                        //Don't stay at exit, creep will loop between room
                        return home.controller;
                    } else {
                        delete creep.memory.wrongRoomCounter;
                    }
                }
                return false;
            }

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

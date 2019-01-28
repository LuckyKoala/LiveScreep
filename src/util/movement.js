let mod = {};
module.exports = mod;

const MovementPriority = [
    //=== Moving roles ===
    //Vital for spawning and defending
    C.FILLER,
    C.GUARDIAN,
    //Precious body role
    C.CLAIMER,
    C.RESERVER,
    //FixWorker which will nor stay in bunker
    C.SCOUT,
    C.PIONEER,
    C.MINER,
    C.HARVESTER,
    C.REMOTE_WORKER,
    C.REMOTE_HARVESTER,
    //Bring resource
    C.HAULER,
    C.REMOTE_HAULER,
    C.RECYCLER,
    //take resource
    C.KEEPER,
    //=== Nearly stationary roles ===
    C.UPGRADER,
    C.BUILDER,
    C.WALLMAINTAINER,
    C.WORKER
];

function movementKey(pos) {
    return `${pos.roomName},${pos.x},${pos.y}`;
}

let movementGlobalState = {};

mod.register = function(creep) {
    movementGlobalState[movementKey(creep.pos)] = creep;
};

mod.unregisterAll = function() {
    movementGlobalState = {};
};


mod.getCreepOfPos = function(pos) {
    return movementGlobalState[movementKey(pos)];
};

mod.getPriorityOfPos = function(pos) {
    const creep = this.getCreepOfPos(pos);
    const lowestPriority = MovementPriority.length;
    if(creep) {
        const lastIdleTick = creep.memory.lastIdleTick || 0;
        if(lastIdleTick===Game.time) return lowestPriority;

        const role = creep.memory.role;
        const index = MovementPriority.indexOf(role);
        return index!==-1 ? index : lowestPriority;
    } else {
        return lowestPriority;
    }
};

mod.cmpPriority = function(posA, posB) {
    return this.getPriorityOfPos(posA) < this.getPriorityOfPos(posB);
};

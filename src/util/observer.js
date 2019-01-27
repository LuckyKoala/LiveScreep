let mod = {};
module.exports = mod;

mod.requestVision = function(roomName) {
    if(this.observers.length === 0) return false;

    for(const observer of this.observers) {
        const observing = observer.memory.observing || {
            time: 0
        };
        if(observing.time===Game.time) continue;
        if(observer.observeRoom(roomName) === OK) {
            observer.memory.observing = {
                time: Game.time,
                room: roomName
            };
            Logger.info(`Observing room [${roomName}]`);
        }
    }
    return true;
};

mod.init = function() {
    //Gather all observers
    this.observers = [];
    for(const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        if(room.memory.roomType !== C.OWNED_ROOM) continue;
        const observer = room.observer;
        if(observer) this.observers.push(observer);
    }
    this.requests = [];
};

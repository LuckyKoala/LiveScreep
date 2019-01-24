let mod = new ActionObj('Pickup');
module.exports = mod;

mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, creep => {
        const remainCapacity = creep.carryCapacity - _.sum(creep.carry);
        const resourceTypeExamine = resource => {
            const role = creep.memory.role;
            if(role===C.HAULER || role===C.REMOTE_HAULER) {
                const homeRoom = Game.rooms[creep.memory.homeRoom];
                if(homeRoom.storage || homeRoom.terminal) {
                    return true;
                }
            }
            return resource.resourceType===RESOURCE_ENERGY;
        }
        let target = creep.pos.findClosestByRange(creep.room.cachedFind(FIND_DROPPED_RESOURCES), {
            filter: function(o) {
                return o.amount >= remainCapacity && resourceTypeExamine(o);
            }
        });
        if(target) return target;
        else {
            //no match, then find any dropped resource
            target = creep.pos.findClosestByRange(creep.room.cachedFind(FIND_DROPPED_RESOURCES), {
                filter: function(o) {
                    return resourceTypeExamine(o);
                }
            });
            return target;
        }
    }, this.actionName, validateFunc);
};

mod.word = '⬆︎ pickup';

const validateFunc = function(creep, target) {
    const resourceTypeExamine = resource => {
        const role = creep.memory.role;
        if(role===C.HAULER || role===C.REMOTE_HAULER) {
            const homeRoom = Game.rooms[creep.memory.homeRoom];
            if(homeRoom.storage || homeRoom.terminal) {
                return true;
            }
        }
        return resource.resourceType===RESOURCE_ENERGY;
    }
    return target.room && target.room.name===creep.room.name && target.amount>0 && resourceTypeExamine(target);
};

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        const result = creep.pickup(target);
        if(result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {range: 1, maxRoomx: 1, visualizePathStyle: {stroke: '#ffaa00'}});
        } else if(result == OK) {
            Util.Mark.unmarkTarget(creep, this.actionName);
        }
    });
};

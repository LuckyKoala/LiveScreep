let mod = new ActionObj('Repair');
module.exports = mod;

mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, creep => {
        //First repair structure except rampart(which will be handled in maintain action)
        //  and wall(whose priority is low)
        let target = creep.pos.findClosestByRange(creep.room.cachedFind(FIND_MY_STRUCTURES), {
            filter: function(o) {
                return o.structureType!=STRUCTURE_RAMPART && o.hits<o.hitsMax;
            }
        });
        if(target) return target;

        //Then repair container
        target = creep.pos.findClosestByRange(creep.room.cachedFind(FIND_STRUCTURES), {
            filter: function(o) {
                //Normally container will be maintain by user, but if it drop down to 1/2 hitsMax, then we builders should help
                return o.structureType===STRUCTURE_CONTAINER && o.hits<o.hitsMax/2;
            }
        });
        if(target) return target;

        //Then road
        target = creep.pos.findClosestByRange(creep.room.cachedFind(FIND_STRUCTURES), {
            filter: function(o) {
                return o.structureType===STRUCTURE_ROAD && o.hits<4/5*o.hitsMax;
            }
        });
        if(target) return target;
        else {
            //No road need to be repair
            if(creep.memory.role===C.BUILDER && creep.room.name!==creep.memory.homeRoom) {
                //Release builder
                creep.room.memory.lastRepairTick = Game.time;
            }
        }

        //Now we can find low hits wall
        return creep.pos.findClosestByRange(Util.Defense.getWallsForMaintain(creep.room));
    }, this.actionName);
};

mod.word = '🚧 repair';

const validateFunc = function(creep, target) {
    return target.room && target.room.name === creep.room.name;
};

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        const result = creep.repair(target);
        if(result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        } else if(result == OK) {
            Util.Stat.incEnergyOut(creep.room.name, creep.getActiveBodyparts(WORK)*REPAIR_POWER*REPAIR_COST);
            if(target.structureType==STRUCTURE_WALL && Util.Defense.canReleaseWall(target.hits)) {
                Util.Mark.unmarkTarget(creep, this.actionName);
            } else if(target.hits==target.hitsMax) {
                Util.Mark.unmarkTarget(creep, this.actionName);
            }
        }
    });
};

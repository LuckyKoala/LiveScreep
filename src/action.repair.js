let mod = new ActionObj('Repair');
module.exports = mod;

mod.nextTarget = function() {
    return Util.Mark.handleMark(this.creep, creep => {
        //First repair structure except rampart(which will be handled in maintain action)
        //  and wall(whose priority is low)
        var target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
            filter: function(o) {
                //return o.structureType!=STRUCTURE_WALL && o.structureType!=STRUCTURE_RAMPART
                // && o.structureType!=STRUCTURE_CONTAINER;
                return o.structureType!=STRUCTURE_RAMPART && o.hits<o.hitsMax;
            }
        });
        if(!target) {
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(o) {
                    return (o.structureType==STRUCTURE_ROAD || o.structureType==STRUCTURE_CONTAINER) 
                       && o.hits<o.hitsMax;
                }
            });
            if(target) return target;
            else {
                //Now we can find low hits wall
                return creep.pos.findClosestByRange(Util.War.getWallsForMaintain(creep.room));
            }
        } else {
            return target;
        }
    }, this.actionName);
};

mod.loop = function(creep) {
    return this.loop0(creep, (creep, target) => {
        //console.log('Loop repair action whose target is '+JSON.stringify(target));
        const result = creep.repair(target);
        if(result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        } else if(result == OK) {
            if(target.structureType==STRUCTURE_WALL && Util.War.canReleaseWall(target.hits)) {
                Util.Mark.unmarkTarget(creep, this.actionName);
            } else if(target.hits==target.hitsMax) {
                Util.Mark.unmarkTarget(creep, this.actionName);
            }
        } 
    });
};
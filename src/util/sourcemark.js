//SourceMark logic goes there
module.exports = {
    loop: function() {
        for(const id in Memory.sources) {
            var source = Game.getObjectById(id);
            if(source) validateSourceMark(source);
        }
    },
    findAndMarkSource: function(creep, dynamic=false) {
        const sources = creep.room.sources;
        for(let source of sources) {
            if(source && isSourceAvailable(creep.getActiveBodyparts(WORK), source, dynamic)) {
                markSource(creep, source);
                return true;
            }
        }

        return false;
    },
    getMarkSource: function(creep) {
        var id = _.get(creep, 'memory.sourceMark.target', false);
        if(id) {
            //return Game.getObjectById(id);
            const source = Game.getObjectById(id);
            if(source) ensureSourceMarkInitialize(source);
            if(_.isUndefined(source.memory.mark.status[creep.name])) {
                console.log(`Clean sourceMark of ${creep.name}`);
                clearSourceMark(creep);
                return false;
            } else {
                return source;
            }
        }
        else {
            return false;
        }
    }
};

/**
 * Source Mark System
 *  -- Source --
 * Memory Path: .memory.mark
 * {
 *   available: {
 *     spots: 3, //Near available pos count
 *     parts: 5, //For 5 work max
 *   },
 *   status: {
 *     %creepName%: %creepMarkParts%,
 *   },
 * }
 *  -- Creep ---
 * Memory Path: .memory.sourceMark
 * {
 *   target: %id%,
 * }
 */
const SourcePartsDefault = SOURCE_ENERGY_CAPACITY/ENERGY_REGEN_TIME/HARVEST_POWER;

function initSourceMark(source) {
    //FIXME only for normal room
    source.memory.mark = {
        available: {
            spots: source.accessibleFields,
            parts: SourcePartsDefault,
        },
        status: {},
    };
}

function isSourceAvailable(workParts, source, dynamic=false) {
    ensureSourceMarkInitialize(source);

    if(dynamic) {
        //Dynamic mark
        const available = source.memory.mark.available;
        const needParts = workParts;
        return available.spots>=1 && available.parts>needParts;
    } else {
        //One harvester per source
        const takenCnt = _.keys(source.memory.mark.status).length;
        return takenCnt === 0;
    }
}

function markSource(creep, source) {
    ensureSourceMarkInitialize(source);
    //Now mark it
    //Update source mark
    var available = source.memory.mark.available;
    var status = source.memory.mark.status;
    var takeParts = creep.getActiveBodyparts(WORK);
    available.spots--;
    available.parts -= takeParts;
    status[creep.name] = takeParts;
    //Write back
    source.memory.mark.available = available;
    source.memory.mark.status = status;
    //Update creep mark
    creep.memory.sourceMark = {
        target: source.id,
    };
    //Log
    console.log("Mark source [" + source.id + "] by "+creep.name);
}

function clearSourceMark(creep) {
    if(!_.isUndefined(creep)) {
        delete creep.memory.sourceMark;
    }
}

function validateSourceMark(source) {
    ensureSourceMarkInitialize(source);

    //Get status
    var available = source.memory.mark.available;
    var status = source.memory.mark.status;
    var updated = false;
    for(var name in status) {
        const creep = Game.creeps[name];
        if(_.isUndefined(creep) || creep.memory.role == 'recycler') {
            //Release mark if creep is dead or creep is recycler 
            //  which means it won't work anymore
            clearSourceMark(creep);
            // release
            available.spots++;
            available.parts += status[name];
            delete status[name];
            updated = true;
        } else {
            let id = _.get(creep, 'memory.sourceMark.target', false);
            //For readability, not to merge this two case in to one
            if(id) {
                //Creep has a mark
                if(id !== source.id) {
                    //Not matched
                    // release
                    available.spots++;
                    available.parts += status[name];
                    delete status[name];
                    updated = true;
                }
            } else {
                //Not matched
                // release
                available.spots++;
                available.parts += status[name];
                delete status[name];
                updated = true;
            }
        }
    }
    if(updated) {
        source.memory.mark.available = available;
        source.memory.mark.status = status;
    }
}

function ensureSourceMarkInitialize(source) {
    //Has source been initialized?
    if(_.isUndefined(source.memory.mark)) {
        initSourceMark(source);
        console.log(`Init source mark for [${source.id}]`);
    }
}

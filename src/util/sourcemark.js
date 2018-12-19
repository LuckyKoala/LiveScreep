//SourceMark logic goes there
module.exports = {
    loop: function() {
        for(var id in Memory.sources) {
            var source = Game.getObjectById(id);
            if(source) validateSourceMark(source);
        }
    },
    findAndMarkSource: function(creep) {
        const sources = creep.room.sources;
        for(let source of sources) {
            if(source && isSourceAvailable(creep.getActiveBodyparts(WORK), source)) {
                markSource(creep, source);
                return true;
            }
        }
        //No exactly matched source
        //Try again to only match source with available spots
        for(let source of sources) {
            if(source && isSourceAvailable(0, source)) {
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
    },
    //Only check spots available > 1
    getAvailablePartsToMatchSource: function(room) {
        const sources = room.sources;
        let maxParts = 0;
        for(var i=0; i<sources.length; i++) {
            var source = sources[i];
            if(source) {
                ensureSourceMarkInitialize(source);
                const available = source.memory.mark.available;
                if(available.spots>=1) maxParts = Math.max(maxParts, available.parts);
            }
        }
        return maxParts;
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

function isSourceAvailable(workParts, source) {
    ensureSourceMarkInitialize(source);
    const available = source.memory.mark.available;
    if(workParts === 0) {
        //So this is not exactly match
        // neglect workParts
        return available.spots>=1;
    }
    const needParts = workParts;
    return available.spots>=1 && available.parts>=needParts;
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
            available.spots++;
            available.parts += status[name];
            delete status[name];
            updated = true;
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

var mod = {};
module.exports = mod;

mod.roomNameToXY = function(name) {

    name = name.toUpperCase();

    var match = name.match(/^(\w)(\d+)(\w)(\d+)$/);
    if(!match) {
        return [undefined, undefined];
    }
    var [,hor,x,ver,y] = match;

    if(hor == 'W') {
        x = -x-1;
    }
    else {
        x = +x;
    }
    if(ver == 'N') {
        y = -y-1;
    }
    else {
        y = +y;
    }
    return [x,y];
};

mod.calcRoomsRealDistance = function(room1, room2) {
    var [x1,y1] = this.roomNameToXY(room1);
    var [x2,y2] = this.roomNameToXY(room2);
    var dx = Math.abs(x2-x1);
    var dy = Math.abs(y2-y1);
    return dx+dy;
};

mod.getBodyCost = function(bodyParts) {
    let cost = 0;
    for(let i=0; i<bodyParts.length; i++) {
        cost += BODYPART_COST[bodyParts[i]];
    }
    return cost;
};

mod.getTerrain = function(roomName) {
    //create 50x50 array
    let arr = new Array(50);
    for (let i = 0; i < 50; i++) {
        arr[i] = new Array(50);
    }
    //set terrain value
    const get = getTerrainAt(roomName);
    for(let x=0; x<50; x++) {
        for(let y=0; y<50; y++) {
            arr[y][x] = get(x,y);
        }
    }
    return arr;
};

mod.findBlockInRoom = function(roomName, xlen, ylen) {
    return findBlock(getTerrainAt(roomName), xlen, ylen, 50, TERRAIN_MASK_WALL);
};

function getTerrainAt(roomName) {
    const terrain = new Room.Terrain(roomName);
    return (x,y) => terrain.get(x,y);
};

//Search direction
//↓↓→→
//One-way search
function findBlock(getFunc, xlen, ylen, width, blockValue) {
    //Search points
    const start = 3; //Away from exit
    let xok = false;
    //Search from start point
    let xpos = start;
    let ypos = start;
    for(let x=start; x<width; x++) {
        let yok = false;
        //Search from ypos line
        for(let y=ypos; y<width; y++) {
            if(getFunc(x,y)===blockValue) {
                //Found wall, so this line is not totally empty
                // this y line should step forward
                // Inc ypos to indicate where to start next time
                ypos = y+1;
                //If we change y line, then x line should change as well
                xpos = x;
            } else if((y-ypos+1) === ylen) {
                //found enough y!
                yok = true;
                if((x-xpos+1) === xlen) {
                    //found enough x!
                    xok = true;
                    return [xpos, ypos];
                } else {
                    //Not enough x, so we keep searching
                    break;
                }
            }
        }
        if(!yok) {
            //So we can't find enough of y
            // this x line should step forward
            // and y line should restore to start line
            xpos=x+1;
            ypos=start;
        }
    }
};

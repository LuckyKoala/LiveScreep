let mod = {};
module.exports = mod;

//Simple:
// sell energy/low mineral in terminal
const COST_LIMIT = 600;
const BASE_COUNT = 1000;
function ordersOf(targetRoom, resourceType, orderType, costLimit=COST_LIMIT) {
    return Game.market.getAllOrders(order => order.resourceType === resourceType &&
                             order.type === orderType &&
                             Game.market.calcTransactionCost(1000, targetRoom, order.roomName) < costLimit);
}

//For ORDER_BUY only.
const ENERGY_PRICE = 0.005;
function profit(targetRoom, order) {
    const cost = Game.market.calcTransactionCost(BASE_COUNT, targetRoom, order.roomName) * ENERGY_PRICE;
    const profit = exampleCount*order.price;
    return profit-cost;
}

mod.loop = function(room) {
    if(!room.terminal || room.terminal.cooldown>0) return;
    const remainAmountOfEnergy = room.terminal.store[RESOURCE_ENERGY];

    //Terminal will be treated as storage since there is no enough resource in storage
    const storageNotEnough = function(storage) {
        return !storage || _.sum(storage.store)<Config.StorageReserveForEnergy;
    };
    if(storageNotEnough(room.storage)) return;

    //Try balance energy among owned rooms
    const terminalCanReceiveAmount = function(terminal) {
        if(!terminal) return 0;
        return terminal.storeCapacity - _.sum(terminal.store);
    };
    for(const roomName in Game.rooms) {
        //Skip self
        if(roomName===room.name) continue;
        const targetRoom = Game.rooms[roomName];
        const roomType = targetRoom.memory.roomType;
        const roomTerminalReceiveTime = room.memory.roomTerminalReceiveTime || 0;

        //Help owned room with not enough energy remain in storage
        if(!roomType || roomType!==C.OWNED_ROOM || !storageNotEnough(targetRoom.storage)) continue;

        const amount = terminalCanReceiveAmount(targetRoom.terminal);
        const distance = Game.map.getRoomLinearDistance(room.name, roomName, true);
        //A owned room in range can only be helped once in a tick
        if(amount===0 || roomTerminalReceiveTime===Game.time || distance>Config.TerminalHelpRoomDistanceMax) continue;

        let sendAmount = Math.min(amount, remainAmountOfEnergy);
        //Send energy when there is some instead of send few energy multiply times
        if(sendAmount<Config.TerminalHelpEnergyMin) break;

        const costAmount = Game.market.calcTransactionCost(sendAmount, room.name, roomName);
        sendAmount -= costAmount;
        if(sendAmount <= 0) continue;

        //Actually send energy
        const sendResult = room.terminal.send(RESOURCE_ENERGY, sendAmount, roomName, 'Energy balance among rooms');
        if(sendResult === OK) {
            Logger.info(`[${room.name}-Terminal balance]Sending ${sendAmount} x energy to ${roomName}`);
            targetRoom.memory.roomTerminalReceiveTime = Game.time;
            return;
        }
    }

    //Sell extra resources
    const energyforCost = remainAmountOfEnergy;
    let sold = false;
    const sell = function(resourceType) {
        const storeAmount = room.terminal.store[resourceType];

        if(sold || storeAmount <= Config.SellExtraResourceBound || energyforCost < COST_LIMIT*storeAmount/BASE_COUNT) return;
        const orders = _.sortBy(ordersOf(room.name, resourceType, ORDER_BUY), [o => profit(room.name, o), o => o.remainingAmount]);
        if(orders.length > 0) {
            const order = orders[0];
            let amount = Math.min(room.terminal.store[resourceType], order.remainingAmount);
            if(resourceType === RESOURCE_ENERGY) {
                const costAmount = Game.market.calcTransactionCost(amount, room.name, order.roomName);
                amount -= costAmount;
            }
            Logger.info(`[${room.name}-Market][${order.id}]Selling ${amount} x ${resourceType} for ${amount*order.price}`);
            const result = Game.market.deal(order.id, amount, room.name);
            if(result === OK) sold = true;
        }
    };

    for(const resourceType in room.terminal.store) {
        if(resourceType === RESOURCE_ENERGY) continue;
        sell(resourceType);
    }
    sell(RESOURCE_ENERGY);
};

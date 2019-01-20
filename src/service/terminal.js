let mod = {};
module.exports = mod;

//Simple:
// sell energy/low mineral in terminal
function ordersOf(targetRoom, resourceType, orderType, costLimit) {
    return Game.market.getAllOrders(order => order.resourceType === resourceType &&
                             order.type === orderType &&
                             Game.market.calcTransactionCost(1000, targetRoom, order.roomName) < costLimit);
}

//For ORDER_BUY only.
const ENERGY_PRICE = 0.005;
function profit(targetRoom, order) {
    const exampleCount = 1000;
    const cost = Game.market.calcTransactionCost(exampleCount, targetRoom, order.roomName) * ENERGY_PRICE;
    const profit = exampleCount*order.price;
    return profit-cost;
}

mod.loop = function(room) {
    if(!room.terminal || room.terminal.cooldown>0) return;

    const energyforCost = room.terminal.store[RESOURCE_ENERGY];
    let sold = false;
    const sell = function(resourceType) {
        const storeAmount = room.terminal.store[resourceType];
        
        if(sold || storeAmount <= Config.SellExtraResourceBound || energyforCost < 600*storeAmount/1000) return;
        const orders = _.sortBy(ordersOf(room.name, resourceType, ORDER_BUY, 600), [o => profit(room.name, o), o => o.remainingAmount]);
        if(orders.length > 0) {
            const order = orders[0];
            let amount = Math.min(room.terminal.store[resourceType], order.remainingAmount);
            if(resourceType === RESOURCE_ENERGY) {
                const costAmount = Game.market.calcTransactionCost(amount, room.name, order.roomName);
                amount -= costAmount;
            }
            Logger.info(`[${room.name}][${order.id}]Selling ${amount} x ${resourceType} for ${order.price}`);
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

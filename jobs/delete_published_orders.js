const { Order } = require('../models');

const deleteOrders = async (bot) => {
    try {
        const windowTime = new Date();
        windowTime.setSeconds(windowTime.getSeconds() - parseInt(process.env.ORDER_PUBLISHED_EXPIRATION_WINDOW));
        // We get the pending orders where time is expired
        const pendingOrders = await Order.find({
            status: 'PENDING',
            created_at: { $lte: windowTime },
        });
        for (const order of pendingOrders) {
            console.log(`Pending order Id: ${order._id} expired after ${process.env.ORDER_PUBLISHED_EXPIRATION_WINDOW} seconds, deleting it from database and channel`);
            // We delete the messages related to that order from the channel
            await order.remove();
            await bot.telegram.deleteMessage(process.env.CHANNEL, order.tg_channel_message1);
        }
    } catch (error) {
        console.log('deleteOrders catch error: ', error);
    }
};

module.exports = deleteOrders;

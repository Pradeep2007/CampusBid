import Item from '../models/Item.js';

export default function socketHandler(io) {
  io.on('connection', (socket) => {
    
    socket.on('joinAuction', (itemId) => {
      socket.join(itemId);
    });

    socket.on('leaveAuction', (itemId) => {
      socket.leave(itemId);
    });

    socket.on('placeBid', async ({ itemId, userId, amount }) => {
      try {
        const item = await Item.findById(itemId);
        
        if (!item || item.status !== 'Active' || new Date(item.endTime) < new Date()) {
          return socket.emit('bidError', { message: 'Auction is not active or has ended' });
        }

        if (amount <= item.currentPrice) {
          return socket.emit('bidError', { message: 'Bid must be higher than current price' });
        }

        const result = await Item.updateOne(
          { _id: itemId, currentPrice: { $lt: amount }, status: 'Active' },
          { 
            $set: { currentPrice: amount },
            $push: { bids: { bidder: userId, amount: amount } }
          }
        );

        if (result.modifiedCount === 1) {
          io.to(itemId).emit('bidUpdate', { 
            itemId, 
            newPrice: amount,
            newBid: { bidder: userId, amount: amount, time: new Date() }
          });
        } else {
           socket.emit('bidError', { message: 'A higher bid was placed before yours' });
        }
      } catch (error) {
        socket.emit('bidError', { message: 'Server error placing bid' });
      }
    });
  });
}
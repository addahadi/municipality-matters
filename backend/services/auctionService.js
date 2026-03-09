const auctionRepository = require('../repositories/auctionRepository');

const auctionService = {
  getAll: () => auctionRepository.findAll(),

  getBids: (auctionId) => auctionRepository.getBids(auctionId),

  create: (data) => auctionRepository.create(data),

  async placeBid(auctionId, citizenId, amount) {
    const auction = await auctionRepository.findById(auctionId);
    if (!auction || auction.status === 'CLOSED') throw new Error('Auction is closed');
    const highest = await auctionRepository.getHighestBid(auctionId);
    if (amount <= highest) throw new Error('Bid must be higher than current highest bid');
    if (amount < auction.starting_price) throw new Error('Bid must be at least the starting price');
    return auctionRepository.placeBid({ auctionId, citizenId, amount });
  },

  async close(auctionId) {
    const highest = await auctionRepository.getHighestBid(auctionId);
    return auctionRepository.close(auctionId, highest || 0);
  },
};

module.exports = auctionService;

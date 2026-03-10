const auctionRepository = require('../repositories/auctionRepository');
const propertyRepository = require('../repositories/propertyRepository');

const auctionService = {
  getAll: () => auctionRepository.findAll(),

  getBids: (auctionId) => auctionRepository.getBids(auctionId),

  async create(data) {
    const auction = await auctionRepository.create(data);
    await propertyRepository.update(data.propertyId, { status: 'AUCTION' });
    return auction;
  },

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
    const auction = await auctionRepository.close(auctionId, highest || 0);
    if (auction) {
      await propertyRepository.update(auction.property_id, { status: 'RENTED' });
    }
    return auction;
  },
};

module.exports = auctionService;

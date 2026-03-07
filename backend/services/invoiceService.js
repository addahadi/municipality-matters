const invoiceRepository = require('../repositories/invoiceRepository');

const invoiceService = {
  getAll: () => invoiceRepository.findAll(),
  getByCitizen: (citizenId) => invoiceRepository.findByCitizen(citizenId),

  async pay(invoiceId, amount) {
    const invoice = await invoiceRepository.findById(invoiceId);
    if (!invoice) throw new Error('Invoice not found');
    if (invoice.status === 'PAID') throw new Error('Invoice already paid');

    const newPaid = parseFloat(invoice.amount_paid) + amount;
    const newRemaining = parseFloat(invoice.total) - newPaid;
    const status = newRemaining <= 0 ? 'PAID' : 'PARTIAL';

    return invoiceRepository.updatePayment(
      invoiceId,
      Math.min(newPaid, parseFloat(invoice.total)),
      Math.max(newRemaining, 0),
      status
    );
  },
};

module.exports = invoiceService;

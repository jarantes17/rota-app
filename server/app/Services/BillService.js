'use strict'

class BillService {
  constructor(modelInstance, trx) {
    this.model = modelInstance
    this.trx = trx
  }

  async syncPayments(payments) {
    await this.model.payments().delete(this.trx)
    await this.model.payments().createMany(payments, this.trx)
  }
}

module.exports = BillService

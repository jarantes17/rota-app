'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * BillTransformer class
 *
 * @class BillTransformer
 * @constructor
 */
class BillTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform(bill) {
    bill = bill.toJSON()
    return {
      id: bill.id,
      payed: bill.payed,
      total_amount: parseFloat(bill.total_amount)
    }
  }
}

module.exports = BillTransformer

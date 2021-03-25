'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const PaymentTypeTransformer = use(
  'App/Transformers/PaymentType/PaymentTypeTransformer'
)

/**
 * BillTransformer class
 *
 * @class BillTransformer
 * @constructor
 */
class BillPaymentTransformer extends BumblebeeTransformer {
  static get availableInclude() {
    return ['type']
  }

  transform(billPayment) {
    billPayment = billPayment.toJSON()
    return {
      payment_type_id: billPayment.payment_type_id,
      bill_id: billPayment.bill_id,
      amount: parseFloat(billPayment.amount)
    }
  }

  includeType(model) {
    return this.item(model.getRelated('type'), PaymentTypeTransformer)
  }
}

module.exports = BillPaymentTransformer

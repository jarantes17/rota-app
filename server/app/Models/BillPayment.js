'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class BillPayment extends Model {
  bill() {
    return this.belongsTo('App/Models/Bill', 'bill_id', 'id')
  }

  type() {
    return this.belongsTo('App/Models/PaymentType', 'payment_type_id', 'id')
  }
}

module.exports = BillPayment

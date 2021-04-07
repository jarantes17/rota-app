'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Bill extends Model {
  payments() {
    return this.hasMany('App/Models/BillPayment')
  }
}

module.exports = Bill

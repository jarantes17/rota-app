'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Customer extends Model {
  address() {
    return this.belongsTo('App/Models/Address', 'address_id', 'id')
  }
}

module.exports = Customer

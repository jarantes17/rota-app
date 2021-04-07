'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Order extends Model {
  static boot() {
    super.boot()

    this.addHook('afterFind', 'OrderHook.updateValues')
    this.addHook('afterPaginate', 'OrderHook.updateCollectionValues')
    this.addHook('afterFetch', 'OrderHook.updateCollectionValues')
  }

  items() {
    return this.hasMany('App/Models/OrderItem')
  }

  board() {
    return this.belongsTo('App/Models/Board', 'board_id', 'id')
  }

  customer() {
    return this.belongsTo('App/Models/Customer', 'customer_id', 'id')
  }
}

module.exports = Order

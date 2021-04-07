'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class OrderItem extends Model {
  static boot() {
    super.boot()

    this.addHook('beforeSave', 'OrderItemHook.updateSubtotal')
  }

  order() {
    return this.belongsTo('App/Models/Order', 'order_id', 'id')
  }

  product() {
    return this.belongsTo('App/Models/Product', 'product_id', 'id')
  }
}

module.exports = OrderItem

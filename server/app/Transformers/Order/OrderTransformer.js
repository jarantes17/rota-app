'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const BoardTransformer = use('App/Transformers/Board/BoardTransformer')
const OrderItemTransformer = use('App/Transformers/Order/OrderItemTransformer')

/**
 * OrderTransformer class
 *
 * @class OrderTransformer
 * @constructor
 */
class OrderTransformer extends BumblebeeTransformer {
  static get availableInclude() {
    return [
      // 'customer',
      'board',
      'items'
    ]
  }

  transform(order) {
    order = order.toJSON()
    return {
      id: order.id,
      total: order.total ? parseFloat(order.total) : 0,
      status: order.status,
      for_delivery: order.for_delivery,
      responsible_name: order.responsible_name,
      total_items: order.__meta__ && parseInt(order.__meta__.total_items),
      created_at: order.created_at,
      updated_at: order.updated_at
    }
  }

  // todo - create after
  // includeCustomer(model) {
  //   return this.item(model.getRelated('customer'), CustomerTransformer)
  // }

  includeBoard(model) {
    return this.item(model.getRelated('board'), BoardTransformer)
  }

  includeItems(model) {
    return this.collection(model.getRelated('items'), OrderItemTransformer)
  }
}

module.exports = OrderTransformer

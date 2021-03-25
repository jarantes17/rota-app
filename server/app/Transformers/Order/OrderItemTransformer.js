'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const ProductTransformer = use('App/Transformers/Order/ProductTransformer')

/**
 * OrderItemTransformer class
 *
 * @class OrderItemTransformer
 * @constructor
 */
class OrderItemTransformer extends BumblebeeTransformer {
  static get defaultInclude() {
    return ['product']
  }

  transform(model) {
    return {
      id: model.id,
      subtotal: model.subtotal,
      quantity: model.quantity,
      observation: model.observation,
      status: model.status,
      cancel_date: model.cancel_date,
      cancel_by: model.cancel_by,
      created_at: model.created_at,
      created_by: model.created_by,
      order_id: model.order_id,
      product_id: model.product_id
    }
  }

  includeProduct(model) {
    return this.item(model.getRelated('product'), ProductTransformer)
  }
}

module.exports = OrderItemTransformer

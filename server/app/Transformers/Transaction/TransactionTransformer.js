'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const ProductTransformer = use('App/Transformers/Order/ProductTransformer')

/**
 * TransactionTransformer class
 *
 * @class TransactionTransformer
 * @constructor
 */
class TransactionTransformer extends BumblebeeTransformer {
  static get defaultInclude() {
    return ['product']
  }

  transform(model) {
    return {
      id: model.id,
      quantity: model.quantity,
      type: model.type,
      transaction_date: model.transaction_date,
      created_at: model.created_at
    }
  }

  includeProduct(model) {
    return this.item(model.getRelated('product'), ProductTransformer)
  }
}

module.exports = TransactionTransformer

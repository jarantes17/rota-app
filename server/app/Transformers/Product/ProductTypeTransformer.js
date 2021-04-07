'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * ProductTypeTransformer class
 *
 * @class ProductTypeTransformer
 * @constructor
 */
class ProductTypeTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform(model) {
    return {
      id: model.id,
      type: model.type,
      created_at: model.created_at,
      updated_at: model.updated_at
    }
  }
}

module.exports = ProductTypeTransformer

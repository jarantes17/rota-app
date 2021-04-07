'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * ProductUomTransformer class
 *
 * @class ProductUomTransformer
 * @constructor
 */
class ProductUomTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform(model) {
    return {
      id: model.id,
      code: model.code,
      description: model.description,
      created_at: model.created_at,
      updated_at: model.updated_at
    }
  }
}

module.exports = ProductUomTransformer

'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * ProductImageTransformer class
 *
 * @class ProductImageTransformer
 * @constructor
 */
class ProductImageTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform(model) {
    model = model.toJSON()
    return {
      id: model.id,
      url: model.url
    }
  }
}

module.exports = ProductImageTransformer

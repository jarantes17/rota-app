'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const ProductImageTransformer = use(
  'App/Transformers/Product/ProductImageTransformer'
)
const ProductTypeTransformer = use(
  'App/Transformers/Product/ProductTypeTransformer'
)
const ProductUomTransformer = use(
  'App/Transformers/Product/ProductUomTransformer'
)
/**
 * ProductTransformer class
 *
 * @class ProductTransformer
 * @constructor
 */
class ProductTransformer extends BumblebeeTransformer {
  static get defaultInclude() {
    return ['type', 'uom', 'image']
  }

  /**
   * This method is used to transform the data.
   */
  transform(model) {
    model = model.toJSON()
    return {
      id: model.id,
      code: model.code,
      description: model.description,
      volume: model.volume,
      resale_price: parseFloat(model.resale_price)
    }
  }

  includeType(model) {
    return this.item(model.getRelated('type'), ProductTypeTransformer)
  }

  includeUom(model) {
    return this.item(model.getRelated('uom'), ProductUomTransformer)
  }

  includeImage(model) {
    return this.item(model.getRelated('image'), ProductImageTransformer)
  }
}

module.exports = ProductTransformer

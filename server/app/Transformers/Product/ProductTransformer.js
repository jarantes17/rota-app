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
    return {
      id: model.id,
      code: model.code,
      description: model.description,
      volume: model.volume,
      purchase_price: parseFloat(model.purchase_price),
      resale_price: parseFloat(model.resale_price),
      resale_product: model.resale_product,
      stock_control: model.stock_control,
      type_id: model.type_id,
      uom_id: model.uom_id,
      status: model.status,
      created_at: model.created_at,
      updated_at: model.updated_at
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

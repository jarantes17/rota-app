'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * SupplierTransformer class
 *
 * @class SupplierTransformer
 * @constructor
 */
class SupplierTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform(model) {
    return {
      id: model.id,
      name: model.name,
      city: model.city,
      freight: model.freight,
      phone: model.phone,
      created_at: model.created_at,
      updated_at: model.updated_at
    }
  }
}

module.exports = SupplierTransformer

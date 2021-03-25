'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * SupplierTransformer class
 *
 * @class PaymentTyperTransformer
 * @constructor
 */
class PaymentTypeTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform(model) {
    return {
      id: model.id,
      name: model.name,
      description: model.description,
      enabled: model.enabled
    }
  }
}

module.exports = PaymentTypeTransformer

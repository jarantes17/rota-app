'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * BoardTransformer class
 *
 * @class BoardTransformer
 * @constructor
 */
class BoardTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform(model) {
    return {
      id: model.id,
      code: model.code,
      status: model.status,
      created_at: model.created_at,
      updated_at: model.updated_at
    }
  }
}

module.exports = BoardTransformer

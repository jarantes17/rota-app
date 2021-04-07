'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * RoleTransformer class
 *
 * @class RoleTransformer
 * @constructor
 */
class RoleTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform(model) {
    return {
      id: model.id,
      slug: model.slug,
      name: model.name,
      description: model.description
    }
  }
}

module.exports = RoleTransformer

'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const RoleTransformer = use('App/Transformers/User/RoleTransformer')

/**
 * UserTransformer class
 *
 * @class UserTransformer
 * @constructor
 */
class UserTransformer extends BumblebeeTransformer {
  static get defaultInclude() {
    return ['roles']
  }

  /**
   * This method is used to transform the data.
   */
  transform(model) {
    return {
      id: model.id,
      name: model.name,
      surname: model.surname,
      email: model.email,
      status: model.status,
      created_at: model.created_at,
      updated_at: model.updated_at
    }
  }

  includeRoles(model) {
    return this.collection(model.getRelated('roles'), RoleTransformer)
  }
}

module.exports = UserTransformer

'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const RoleTransformer = use('App/Transformers/User/RoleTransformer')

/**
 * AuthTransformer class
 *
 * @class AuthTransformer
 * @constructor
 */
class AuthTransformer extends BumblebeeTransformer {
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
      email: model.email
    }
  }

  includeRoles(user) {
    return this.collection(user.getRelated('roles'), RoleTransformer)
  }
}

module.exports = AuthTransformer

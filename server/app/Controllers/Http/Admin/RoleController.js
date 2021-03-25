'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Role = use('App/Models/Role')
const Transformer = use('App/Transformers/User/RoleTransformer')

class RoleController {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async index({ request, response, transform }) {
    const { type } = request.post()
    let roles = await Role.query().orderBy('id').fetch()

    if (type === 'all') {
      roles = roles.filter((item) => item.id !== 1) // remove admin role
    }

    roles = await transform.collection(roles, Transformer)

    return response.status(200).send({
      data: {
        roles: roles
      }
    })
  }
}

module.exports = RoleController

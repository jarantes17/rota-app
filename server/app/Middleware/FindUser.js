'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use('App/Models/User')

class FindUser {
  /**
   * @param {object} ctx
   * @param {Function} next
   */
  async handle(ctx, next) {
    const { request, response } = ctx
    const { id } = request.params
    const user = await User.find(id)

    if (!user) {
      return response.status(404).json({
        message: 'Usuário não econtrado',
        id
      })
    }

    ctx.user = user

    await next()
  }
}

module.exports = FindUser

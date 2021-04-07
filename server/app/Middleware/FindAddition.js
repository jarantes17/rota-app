'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Addition = use('App/Models/Addition')

class FindAddition {
  /**
   * @param {object} ctx
   * @param {Function} next
   */
  async handle(ctx, response, next) {
    const { id } = ctx.request.params
    const addition = await Addition.find(id)

    if (!addition) {
      return response.status(404).json({
        message: 'Adicional não encontrado',
        id
      })
    }

    ctx.addition = addition

    await next()
  }
}

module.exports = FindAddition

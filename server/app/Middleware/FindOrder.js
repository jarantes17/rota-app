'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Order = use('App/Models/Order')

class FindOrder {
  /**
   * @param {object} ctx
   * @param {Function} next
   */
  async handle(ctx, next) {
    const { request, response } = ctx
    const { id } = request.params
    const order = await Order.find(id)

    if (!order) {
      return response.status(404).json({
        message: 'Pedido não encontrado',
        id
      })
    }

    ctx.order = order

    await next()
  }
}

module.exports = FindOrder

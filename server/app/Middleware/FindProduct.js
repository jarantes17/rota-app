'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Product = use('App/Models/Product')

class FindProduct {
  /**
   * @param {object} ctx
   * @param {Function} next
   */
  async handle(ctx, next) {
    const { request, response } = ctx
    const { id } = request.params
    const product = await Product.find(id)

    if (!product) {
      return response.status(404).json({
        message: 'Produto não encontrado',
        id
      })
    }

    ctx.product = product

    await next()
  }
}

module.exports = FindProduct

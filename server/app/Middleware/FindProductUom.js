'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const ProductUom = use('App/Models/ProductUom')

class FindProductUom {
  /**
   * @param {object} ctx
   * @param {Function} next
   */
  async handle(ctx, next) {
    const { request, response } = ctx
    const { id } = request.params
    const productUom = await ProductUom.find(id)

    if (!productUom) {
      return response.status(404).json({
        message: 'Unidade de medida não encontrada',
        id
      })
    }

    ctx.productUom = productUom

    await next()
  }
}

module.exports = FindProductUom

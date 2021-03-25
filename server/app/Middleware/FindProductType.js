'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const ProductType = use('App/Models/ProductType')

class FindProductType {
  /**
   * @param {object} ctx
   * @param {Function} next
   */
  async handle(ctx, next) {
    const { request, response } = ctx
    const { id } = request.params
    const productType = await ProductType.find(id)

    if (!productType) {
      return response.status(404).json({
        message: 'Tipo de produto não encontrado',
        id
      })
    }

    ctx.productType = productType

    await next()
  }
}

module.exports = FindProductType

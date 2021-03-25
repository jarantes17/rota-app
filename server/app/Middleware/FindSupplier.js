'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Supplier = use('App/Models/Supplier')

class FindSupplier {
  /**
   * @param {object} ctx
   * @param {Function} next
   */
  async handle(ctx, next) {
    const { request, response } = ctx
    const { id } = request.params
    const supplier = await Supplier.find(id)

    if (!supplier) {
      return response.status(404).json({
        message: 'Fornecedor não econtrado',
        id
      })
    }

    ctx.supplier = supplier

    await next()
  }
}

module.exports = FindSupplier

'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Bill = use('App/Models/Bill')

class FindBill {
  /**
   * @param {object} ctx
   * @param {Function} next
   */
  async handle(ctx, next) {
    const { request, response } = ctx
    const { id } = request.params
    const bill = await Bill.find(id)

    if (!bill) {
      return response.status(404).json({
        message: 'Conta não encontrada',
        id
      })
    }

    ctx.bill = bill

    await next()
  }
}

module.exports = FindBill

'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const PaymentType = use('App/Models/PaymentType')

class FindPaymentType {
  /**
   * @param {object} ctx
   * @param {Function} next
   */
  async handle(ctx, next) {
    const { request, response } = ctx
    const { id } = request.params
    const paymentType = await PaymentType.find(id)

    if (!paymentType) {
      return response.status(404).json({
        message: 'Método de pagamento não encontrado',
        id
      })
    }

    ctx.paymentType = paymentType

    await next()
  }
}

module.exports = FindPaymentType

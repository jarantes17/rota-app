'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const PaymentType = use('App/Models/PaymentType')
const Transformer = use('App/Transformers/PaymentType/PaymentTypeTransformer')

class PaymentTypeController {
  /**
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async index({ response, transform }) {
    let paymentTypes = await PaymentType.query()
      .where('enabled', true)
      .orderBy('id')
      .fetch()
    paymentTypes = await transform.collection(paymentTypes, Transformer)

    return response.status(200).send({
      data: {
        paymentTypes: paymentTypes
      }
    })
  }
}

module.exports = PaymentTypeController

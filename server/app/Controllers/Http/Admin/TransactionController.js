'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const { startOfYesterday } = use('date-fns')
const Transaction = use('App/Models/Transaction')

const Transformer = use('App/Transformers/Transaction/TransactionTransformer')

/**
 * Resourceful controller for interacting with transactions
 */
class TransactionController {
  /**
   * Show a list of all transactions.
   * GET transactions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async index({ request, response, transform }) {
    let transactions = await Transaction.query()
      .where('created_at', '>=', startOfYesterday())
      .orderBy('created_at')
      .fetch()

    transactions = await transform
      .include('product')
      .collection(transactions, Transformer)

    return response.status(200).send({
      data: {
        transactions: transactions
      }
    })
  }
}

module.exports = TransactionController

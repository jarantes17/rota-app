'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Expense = use('App/Models/Expense')

class FindExpense {
  /**
   * @param {object} ctx
   * @param {Function} next
   */
  async handle(ctx, next) {
    const { request, response } = ctx
    const { id } = request.params
    const expense = await Expense.find(id)

    if (!expense) {
      return response.status(404).json({
        message: 'Despesa não encontrada',
        id
      })
    }

    ctx.expense = expense

    await next()
  }
}

module.exports = FindExpense

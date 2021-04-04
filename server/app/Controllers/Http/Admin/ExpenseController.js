'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {import('../../../Helpers')} */
const Expense = use('App/Models/Expense')
const FlexField = use('App/Models/FlexField')
const Transformer = use('App/Transformers/Expense/ExpenseTransformer')

class ExpenseController {
  /**
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async index({ response, transform }) {
    let expenses = await Expense.query().orderBy('id').fetch()
    let expenseTypes = await FlexField.query()
      .where('name', 'EXPENSE_TYPES')
      .where('status', 'A')
      .fetch()

    expenses = await transform.collection(expenses, Transformer)

    return response.status(200).send({
      data: {
        expenses: expenses,
        expenseTypes: expenseTypes.rows.map((et) => {
          return {
            name: et.name,
            value: et.value,
            description: et.description
          }
        })
      }
    })
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, transform }) {
    const data = request.only(['code', 'status'])
    let expense = await Expense.create(data)

    expense = await transform.item(expense, Transformer)

    return response.status(201).send({
      data: {
        expense: expense
      }
    })
  }

  /**
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async show({ response, expense, transform }) {
    expense = await transform.item(expense, Transformer)

    return response.status(200).send({
      data: {
        expense: expense
      }
    })
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ request, response, expense, transform }) {
    const { code, status } = request.post()
    expense.code = code || expense.code
    expense.status = status || expense.status

    await expense.save()

    expense = await transform.item(expense, Transformer)

    return response.status(200).send({
      data: {
        expense: expense
      }
    })
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ response, expense }) {
    await expense.delete()
    return response.status(204).send()
  }
}

module.exports = ExpenseController

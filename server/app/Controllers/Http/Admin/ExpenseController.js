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
    const expenseTypes = await FlexField.query()
      .where('name', 'EXPENSE_TYPES')
      .where('status', 'A')
      .fetch()

    expenses = await transform.collection(expenses, Transformer)

    return response.status(200).send({
      data: {
        expenses: expenses.map((e) => {
          return {
            ...e,
            type: expenseTypes.rows.find(
              (et) => et.name === 'EXPENSE_TYPES' && et.value === e.type
            )
          }
        }),
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
    const data = request.only(['type', 'amount', 'pay_date', 'observation'])
    let expense = await Expense.create(data)

    expense = await transform.item(expense, Transformer)

    const expenseTypes = await FlexField.query()
      .where('name', 'EXPENSE_TYPES')
      .where('status', 'A')
      .fetch()

    return response.status(201).send({
      data: {
        expense: {
          ...expense,
          type: expenseTypes.rows.find(
            (et) => et.name === 'EXPENSE_TYPES' && et.value === expense.type
          )
        }
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
    const { type, amount, pay_date, observation } = request.all()
    expense.type = type || expense.type
    expense.amount = amount || expense.amount
    expense.pay_date = pay_date || expense.pay_date
    expense.observation = observation || expense.observation

    await expense.save()

    const expenseTypes = await FlexField.query()
      .where('name', 'EXPENSE_TYPES')
      .where('status', 'A')
      .fetch()

    expense = await transform.item(expense, Transformer)

    return response.status(200).send({
      data: {
        expense: {
          ...expense,
          type: expenseTypes.rows.find(
            (et) => et.name === 'EXPENSE_TYPES' && et.value === expense.type
          )
        }
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

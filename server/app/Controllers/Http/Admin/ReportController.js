'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const { lastDayOfMonth, startOfMonth, startOfDay } = use('date-fns')
const { boardStatus } = use('App/Helpers')
const Board = use('App/Models/Board')
const Order = use('App/Models/Order')

const Database = use('Database')

class ReportController {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async expenseRevenue({ request, response }) {
    const { month, year } = request.all()
    const targetDate = new Date(year, month - 1, 1)
    const startDay = startOfMonth(targetDate)
    const endDay = lastDayOfMonth(targetDate)

    const monthResume = await Database.raw(
      'select * from fu_get_month_resume(?,?)',
      [month, year]
    )
    const monthBalance = await Database.raw(
      'select * from fu_get_month_balance(?,?)',
      [startDay, endDay]
    )

    return response.status(200).send({
      data: {
        month_resume: {
          amount_revenues: parseFloat(monthResume.rows[0].amount_revenues),
          amount_expenses: parseFloat(monthResume.rows[0].amount_expenses)
        },
        month_balance: monthBalance.rows.map((mb) => {
          return {
            trade_date: mb.trade_date,
            amount_revenue_of_day: parseFloat(mb.amount_revenue_of_day),
            amount_expense_of_day: parseFloat(mb.amount_expense_of_day)
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
  async resumeInfo({ response }) {
    const boards = await Board.query()
      .where('status', boardStatus.BUSY)
      .orderBy('id')
      .fetch()

    const ordersQuery = Order.query()
    ordersQuery.where('created_at', '>=', startOfDay(new Date()))
    ordersQuery.whereNotIn('status', ['Closed', 'Canceled'])
    const orders = await ordersQuery.fetch()

    const deliveriesQuery = Order.query()
    deliveriesQuery.where('created_at', '>=', startOfDay(new Date()))
    deliveriesQuery.where('for_delivery', true)
    const deliveries = await deliveriesQuery.fetch()

    return response.status(200).send({
      data: {
        boards: boards.rows.length,
        orders: orders.rows.length,
        deliveries: deliveries.rows.length
      }
    })
  }
}

module.exports = ReportController

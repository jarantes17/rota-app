'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

import { lastDayOfMonth, startOfMonth } from 'date-fns'

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
}

module.exports = ReportController

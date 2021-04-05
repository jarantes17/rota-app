'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Database = use('Database')

class CashController {
  /**
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {Response} ctx.response
   */
  async index({ request, response }) {
    const { cash_date } = request.all()
    const cashInfo = await Database.raw('select * from fu_get_cash_info(?)', [
      cash_date
    ])
    const hourByHour = await Database.raw(
      'select * from fu_get_cash_hour_by_hour(?)',
      [cash_date]
    )
    const amountByPaymentTypes = await Database.raw(
      'select * from fu_get_payments_by_type(?)',
      [cash_date]
    )
    return response.status(200).send({
      data: {
        cash_info: {
          amount_entry: parseFloat(cashInfo.rows[0].amount_entry),
          amount_out: parseFloat(cashInfo.rows[0].amount_out),
          total_closed: parseInt(cashInfo.rows[0].total_closed),
          total_opened: parseInt(cashInfo.rows[0].total_opened)
        },
        hour_by_hour: {
          hours_of_day: hourByHour.rows.map((h) => {
            return h.hour_of_day
          }),
          amounts: hourByHour.rows.map((h) => {
            return parseFloat(h.total_amount)
          })
        },
        amount_by_payment_types: amountByPaymentTypes
      }
    })
  }
}

module.exports = CashController

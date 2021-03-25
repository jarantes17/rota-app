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
    return response.status(200).send({
      data: {
        cash_info: cashInfo.rows[0],
        hour_by_hour: {
          hours_of_day: hourByHour.rows.map((h) => {
            return h.hour_of_day
          }),
          amounts: hourByHour.rows.map((h) => {
            return parseFloat(h.total_amount)
          })
        }
      }
    })
  }
}

module.exports = CashController

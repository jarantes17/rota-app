'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Database = use('Database')

const Bill = use('App/Models/Bill')
const BillPayment = use('App/Models/BillPayment')
const Order = use('App/Models/Order')
const OrderItem = use('App/Models/OrderItem')

/** @type {typeof import('../../../Services/BillService')} */
const BillService = use('App/Services/BillService')

const BillTransformer = use('App/Transformers/Bill/BillTransformer')
const BillPaymentTransformer = use(
  'App/Transformers/Bill/BillPaymentTransformer'
)
const OrderTransformer = use('App/Transformers/Order/OrderTransformer')

class BillController {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async index({ request, response, transform, auth }) {
    const trx = await Database.beginTransaction()
    try {
      const { order_id } = request.all()

      let bill = await Bill.findBy('order_id', order_id)
      let order = await Order.findBy('id', order_id)

      if (!bill) {
        const totalAmount = await order
          .items()
          .whereNot('status', 'Canceled')
          .getSum('subtotal')

        const user = await auth.getUser()
        bill = await Bill.create({
          created_by: user.id,
          total_amount: totalAmount,
          order_id,
          payed: false
        })
      }

      let payments = await BillPayment.query()
        .with('type')
        .where('bill_id', bill.id)
        .fetch()

      payments = await transform
        .include('type')
        .collection(payments, BillPaymentTransformer)

      order = await transform
        .include('items, board')
        .item(order, OrderTransformer)

      bill = await transform.item(bill, BillTransformer)

      return response.status(200).send({
        data: {
          bill: {
            ...bill,
            order: order,
            payments: payments
          }
        }
      })
    } catch (error) {
      await trx.rollback()
      return response.status(400).send({
        message: 'Falha ao calcular conta!'
      })
    }
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ request, response, bill, transform, auth }) {
    const trx = await Database.beginTransaction()
    try {
      const { payed, payments, order } = request.all()
      const service = new BillService(bill, trx)

      const _payments = payments.map((payment) => {
        delete payment.type
        return payment
      })

      await service.syncPayments(_payments)

      const targetOrder = await Order.findOrFail(order.id)
      targetOrder.status = 'Closed'
      targetOrder.save(trx)

      const targetItems = await OrderItem.query()
        .where('order_id', order.id)
        .where('status', 'Opened')
        .fetch()

      await Promise.all(
        targetItems.rows.map(async (item) => {
          item.status = 'Closed'
          await item.save(trx)
        })
      )

      bill.payed = payed
      await bill.save(trx)

      await trx.commit()

      return response.status(204).send()
    } catch (error) {
      await trx.rollback()
      return response.status(400).send({
        message: 'Não foi possível encerrar a conta no momento!'
      })
    }
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async savePayments({ request, response }) {
    const trx = await Database.beginTransaction()
    try {
      const { bill_id, payments } = request.all()

      const bill = await Bill.findOrFail(bill_id)
      const service = new BillService(bill, trx)

      await service.syncPayments(payments)

      await trx.commit()

      return response.status(204).send()
    } catch (error) {
      await trx.rollback()
      return response.status(400).send({
        message: 'Não foi salvar os pagamentos no momento!'
      })
    }
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async coupon({ request, response }) {
    // generate fiscal coupon
  }
}

module.exports = BillController

'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const { startOfYesterday } = use('date-fns')
const Database = use('Database')

const Order = use('App/Models/Order')
const OrderItem = use('App/Models/OrderItem')
const Board = use('App/Models/Board')

const OrderService = use('App/Services/OrderService')

const Transformer = use('App/Transformers/Order/OrderTransformer')

class OrderController {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async index({ transform, response, pagination }) {
    const orders = await Order.query()
      .orderBy('id', 'DESC')
      .paginate(pagination.page, pagination.perpage)
    return response.send(
      await transform.include('items, board').paginate(orders, Transformer)
    )
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async opened({ response, transform }) {
    const ordersQuery = Order.query()

    ordersQuery.where('created_at', '>=', startOfYesterday())
    ordersQuery.whereNotIn('status', ['Closed', 'Canceled'])

    let orders = await ordersQuery.orderBy('id').fetch()
    orders = await transform
      .include('items, board')
      .collection(orders, Transformer)

    return response.status(200).send({
      data: {
        orders: orders
      }
    })
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, transform, auth }) {
    const trx = await Database.beginTransaction()
    try {
      const {
        customer_id,
        board_id,
        responsible_name,
        status,
        for_delivery,
        items
      } = request.all()

      const user = await auth.getUser()

      const _items = items.map((item) => {
        delete item.product
        item.created_by = user.id
        return item
      })

      let order = await Order.create(
        {
          customer_id,
          board_id,
          responsible_name,
          status,
          for_delivery
        },
        trx
      )

      const service = new OrderService(order, trx)
      if (items.length > 0) {
        await service.syncItems(_items)
      }

      if (board_id && status === 'Opened') {
        const board = await Board.find(board_id)
        board.status = 'Busy'
        await board.save(trx)
      }

      await trx.commit()

      order = await Order.find(order.id)
      order = await transform.include('items, board').item(order, Transformer)

      return response.status(201).send({
        data: {
          newOrder: order
        }
      })
    } catch (error) {
      await trx.rollback()
      return response.status(400).send({
        message: 'Não foi possível criar seu pedido no momento!'
      })
    }
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async show({ response, order, transform }) {
    order = await transform.include('items, board').item(order, Transformer)

    return response.status(200).send({
      data: {
        order: order
      }
    })
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ request, response, order, transform, auth }) {
    const trx = await Database.beginTransaction()
    try {
      let {
        customer_id,
        board_id,
        responsible_name,
        status,
        for_delivery,
        items
      } = request.all()

      if (board_id && order.board_id !== board_id) {
        if (status === 'Opened') {
          const board = Board.find(board_id)
          board.status = 'Busy'
          await board.save(trx)
        }
      }

      order.merge({
        customer_id,
        board_id,
        responsible_name,
        status,
        for_delivery
      })

      const service = new OrderService(order, trx)

      const user = await auth.getUser()

      // remove trash from item
      items = items.map((item) => {
        delete item.product
        if (!item.created_by) item.created_by = user.id
        return item
      })
      await service.syncItems(items)

      await order.save(trx)
      await trx.commit()

      order = await Order.find(order.id)
      order = await transform.include('items, board').item(order, Transformer)

      return response.status(200).send({
        data: {
          updatedOrder: order
        }
      })
    } catch (error) {
      await trx.rollback()
      return response.status(400).send({
        message: 'Não foi possível atualizar seu pedido no momento!'
      })
    }
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ response, order }) {
    const trx = await Database.beginTransaction()
    try {
      await order.items().delete(trx)
      await order.delete(trx)
      return response.status(204).send()
    } catch (error) {
      await trx.rollback()
      return response.status(400).send({
        message: 'Erro ao deletar este pedido!'
      })
    }
  }

  async cancel({ response, request }) {
    const { order_id, order_item_id } = request.all()
    try {
      const order = await Order.find(order_id)
      const orderItem = await OrderItem.find(order_item_id)

      if (order.status === 'Opened') {
        orderItem.status = 'Canceled'
        await orderItem.save()
      }

      return response.status(204).send()
    } catch (error) {
      return response.status(400).send({
        message: `Erro ao cancelar item do pedido ${order_id}`
      })
    }
  }
}

module.exports = OrderController

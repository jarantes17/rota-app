'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {import('../../../Helpers')} */
const { boardStatus } = use('App/Helpers')
const Board = use('App/Models/Board')
const Transformer = use('App/Transformers/Board/BoardTransformer')

class BoardController {
  /**
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async index({ response, transform }) {
    let boards = await Board.query().orderBy('id').fetch()

    boards = await transform.collection(boards, Transformer)

    return response.status(200).send({
      data: {
        boards: boards
      }
    })
  }

  /**
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async busy({ response, transform }) {
    let boards = await Board.query()
      .where('status', boardStatus.BUSY)
      .orderBy('id')
      .fetch()

    boards = await transform.collection(boards, Transformer)

    return response.status(200).send({
      data: {
        boards: boards
      }
    })
  }

  /**
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async leave({ request, response, transform }) {
    const { ids_to_leave } = request.only(['ids_to_leave'])

    await Promise.all(
      Object.values(ids_to_leave).map(async (id) => {
        const board = await Board.find(id)
        board.status = 'Free'
        await board.save()
      })
    )

    return response.status(204).send()
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, transform }) {
    const data = request.only(['code', 'status'])
    let board = await Board.create(data)

    board = await transform.item(board, Transformer)

    return response.status(201).send({
      data: {
        board: board
      }
    })
  }

  /**
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async show({ response, board, transform }) {
    board = await transform.item(board, Transformer)

    return response.status(200).send({
      data: {
        board: board
      }
    })
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ request, response, board, transform }) {
    const { code, status } = request.post()
    board.code = code || board.code
    board.status = status || board.status

    await board.save()

    board = await transform.item(board, Transformer)

    return response.status(200).send({
      data: {
        board: board
      }
    })
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ response, board }) {
    await board.delete()
    return response.status(204).send()
  }
}

module.exports = BoardController

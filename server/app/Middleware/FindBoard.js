'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Board = use('App/Models/Board')

class FindBoard {
  /**
   * @param {object} ctx
   * @param {Function} next
   */
  async handle(ctx, next) {
    const { request, response } = ctx
    const { id } = request.params
    const board = await Board.find(id)

    if (!board) {
      return response.status(404).json({
        message: 'Mesa não encontrada',
        id
      })
    }

    ctx.board = board

    await next()
  }
}

module.exports = FindBoard

'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class FindRefreshToken {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle(ctx, next) {
    const { request } = ctx
    var refreshToken = request.input('refresh_token')

    if (!refreshToken) {
      refreshToken = request.header('refresh_token')
    }

    ctx.refreshToken = refreshToken

    await next()
  }
}

module.exports = FindRefreshToken

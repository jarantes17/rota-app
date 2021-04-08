'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class HomeController {
  /**
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async index({ response }) {
    response
      .status(200)
      .json({ message: 'Welcome to Rota API', vesion: '1.0.1' })
  }
}

module.exports = HomeController

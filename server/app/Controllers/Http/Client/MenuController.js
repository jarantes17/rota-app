'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Env = use('Env')

class MenuController {
  /**
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async index({ response }) {
    response.status(200).send({
      data: {
        menu_pdf: `${Env.get('APP_URL')}/files/cardapio.pdf`
      }
    })
  }
}

module.exports = MenuController

'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Addition = use('App/Models/Addition')

class AdditionController {
  /**
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async index({ response }) {
    const additions = await Addition.query().orderBy('id').fetch()
    return response.status(200).send({
      data: additions
    })
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const data = request.only(['description', 'price', 'enabled'])
    const addition = await Addition.create(data)

    return response.status(201).send({
      data: addition
    })
  }

  /**
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async show({ response, addition }) {
    return response.status(200).send({
      data: addition
    })
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ request, response, addition }) {
    const { description, price, enabled } = request.post()
    addition.description = description || addition.description
    addition.price = price || addition.price
    addition.enabled = enabled || addition.enabled

    await addition.save()

    return response.status(200).send({
      data: addition
    })
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ response, addition }) {
    await addition.delete()
    return response.status(204).send()
  }
}

module.exports = AdditionController

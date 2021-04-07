'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const ProductType = use('App/Models/ProductType')

const Transformer = use('App/Transformers/Product/ProductTypeTransformer')

class ProductTypeController {
  /**
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async index({ response, transform }) {
    let productTypes = await ProductType.query().orderBy('id').fetch()

    productTypes = await transform.collection(productTypes, Transformer)

    return response.status(200).send({
      data: {
        productTypes: productTypes
      }
    })
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, transform }) {
    const data = request.only(['type'])
    let productType = await ProductType.create(data)

    productType = await transform.item(productType, Transformer)

    return response.status(201).send({
      data: {
        productType: productType
      }
    })
  }

  /**
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async show({ response, productType, transform }) {
    productType = await transform.item(productType, Transformer)

    return response.status(200).send({
      data: {
        productType: productType
      }
    })
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ request, response, productType, transform }) {
    const { type } = request.post()
    productType.merge({ type })

    await productType.save()

    productType = await transform.item(productType, Transformer)

    return response.status(200).send({
      data: {
        productType: productType
      }
    })
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ response, productType }) {
    await productType.delete()
    return response.status(204).send()
  }
}

module.exports = ProductTypeController

'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const ProductUom = use('App/Models/ProductUom')

const Transformer = use('App/Transformers/Product/ProductUomTransformer')

class ProductUomController {
  /**
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async index({ response, transform }) {
    let productUoms = await ProductUom.query().orderBy('id').fetch()

    productUoms = await transform.collection(productUoms, Transformer)

    return response.status(200).send({
      data: {
        productUoms: productUoms
      }
    })
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, transform }) {
    const data = request.only(['code', 'description'])
    let productUom = await ProductUom.create(data)

    productUom = await transform.item(productUom, Transformer)

    return response.status(201).send({
      data: {
        productUom: productUom
      }
    })
  }

  /**
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async show({ response, productUom, transform }) {
    productUom = await transform.item(productUom, Transformer)

    return response.status(200).send({
      data: {
        productUom: productUom
      }
    })
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ request, response, productUom, transform }) {
    const { code, description } = request.post()
    productUom.type = code || productUom.code
    productUom.description = description || productUom.description

    await productUom.save()

    productUom = await transform.item(productUom, Transformer)

    return response.status(200).send({
      data: {
        productUom: productUom
      }
    })
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ response, productUom }) {
    productUom.delete()
    return response.status(204).send()
  }
}

module.exports = ProductUomController

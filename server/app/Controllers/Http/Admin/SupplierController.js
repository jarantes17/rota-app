'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Supplier = use('App/Models/Supplier')
const Transformer = use('App/Transformers/Supplier/SupplierTransformer')

class SupplierController {
  /**
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async index({ response, transform }) {
    let suppliers = await Supplier.query().orderBy('id').fetch()

    suppliers = await transform.collection(suppliers, Transformer)

    return response.status(200).send({
      data: {
        suppliers: suppliers
      }
    })
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, transform }) {
    const data = request.only(['name', 'city', 'freight', 'phone'])
    let supplier = await Supplier.create(data)

    supplier = await transform.item(supplier, Transformer)

    return response.status(201).send({
      data: {
        supplier: supplier
      }
    })
  }

  /**
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async show({ response, supplier, transform }) {
    supplier = await transform.item(supplier, Transformer)

    return response.status(200).send({
      data: {
        supplier: supplier
      }
    })
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ request, response, supplier, transform }) {
    const { name, city, freight, phone } = request.post()
    supplier.name = name || supplier.name
    supplier.city = city || supplier.city
    supplier.freight = freight || supplier.freight
    supplier.phone = phone || supplier.phone

    await supplier.save()

    supplier = await transform.item(supplier, Transformer)

    return response.status(200).send({
      data: {
        supplier: supplier
      }
    })
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ response, supplier }) {
    await supplier.delete()
    return response.status(204).send()
  }
}

module.exports = SupplierController

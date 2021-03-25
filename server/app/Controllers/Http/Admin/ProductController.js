/* eslint-disable camelcase */
'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Helpers = use('Helpers')
const fs = use('fs')
const DataBase = use('Database')

const Product = use('App/Models/Product')
const Image = use('App/Models/Image')

const ProductService = use('App/Services/ProductService')
const ImageService = use('App/Services/ImageService')

const Transformer = use('App/Transformers/Product/ProductTransformer')

class ProductController {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async index({ request, response, transform }) {
    const { description, code, resale_product } = request.all()
    const productQuery = Product.query()

    if (description) {
      productQuery.where('description', 'like', `%${description}%`)
    }
    if (code) {
      productQuery.where('code', 'like', `%${code}%`)
    }
    if(resale_product) {
      productQuery.where('resale_product', resale_product)
    }

    let products = await productQuery.orderBy('id').fetch()
    products = await transform.collection(products, Transformer)

    return response.status(200).send({
      data: {
        products: products
      }
    })
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, transform }) {
    const trx = await DataBase.beginTransaction()

    try {
      const {
        code,
        description,
        volume,
        purchase_price,
        resale_price,
        stock_control,
        resale_product,
        uom_id,
        type_id
      } = request.all()

      const fileJar = request.file('file', {
        types: ['image'],
        size: '2mb'
      })

      const is = new ImageService(null, trx)
      const image = await is.upload(fileJar)

      let product = await Product.create(
        {
          code,
          description,
          volume,
          purchase_price,
          resale_price,
          stock_control,
          resale_product,
          uom_id,
          type_id,
          image_id: image ? image.id : null,
          status: 'A'
        },
        trx
      )

      await trx.commit()

      product = await transform.item(product, Transformer)

      return response.status(201).send({
        data: {
          product: product
        }
      })
    } catch (error) {
      await trx.rollback()
      return response.status(400).send({
        message: 'Não foi possível criar o produto no momento!'
      })
    }
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async show({ response, product, transform }) {
    product = await transform.item(product, Transformer)

    return response.status(200).send({
      data: {
        product: product
      }
    })
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ request, response, product, transform }) {
    const trx = await DataBase.beginTransaction()

    try {
      const {
        code,
        description,
        volume,
        purchase_price,
        resale_price,
        stock_control,
        uom_id,
        type_id,
        image_id
      } = request.all()

      if (image_id) {
        const image = await Image.findOrFail(image_id)

        const filePath = Helpers.publicPath(`uploads/${image.path}`)
        await fs.unlink(filePath, (err) => {
          if (err) throw err
        })

        await image.delete(trx)
      }

      const fileJar = request.file('image', {
        types: ['image'],
        size: '2mb'
      })

      const is = new ImageService(null, trx)
      const image = is.upload(fileJar)

      product.merge({
        code,
        description,
        volume,
        purchase_price,
        resale_price,
        stock_control,
        uom_id,
        type_id,
        image_id: image ? image.id : null
      })

      await product.save(trx)

      await trx.commit()

      product = await transform.item(product, Transformer)

      return response.status(200).send({
        data: {
          product: product
        }
      })
    } catch (error) {
      await trx.rollback()
      return response.status(400).send({
        message: 'Não foi possível atualizar o produto no momento!'
      })
    }
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ response, product }) {
    await product.delete()
    return response.status(204).send()
  }

  /**
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async code({ response }) {
    const service = new ProductService(null, null)
    const productCode = await service.getProductCode()
    return response.status(200).send({
      code: productCode
    })
  }
}

module.exports = ProductController

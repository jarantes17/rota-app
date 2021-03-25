'use strict'

/** @type {import('@adonisjs/lucid/src/Database')} */
const DataBase = use('Database')
// const Product = use('App/Models/Product')

class ProductService {
  constructor(modelInstance, trx) {
    this.model = modelInstance
    this.trx = trx
  }

  async getProductCode() {
    const result = await DataBase.raw('SELECT public.fu_get_product_code()')
    return result.rows[0].fu_get_product_code
  }
}

module.exports = ProductService

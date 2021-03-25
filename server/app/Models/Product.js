'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Product extends Model {
  uom() {
    return this.belongsTo('App/Models/ProductUom', 'uom_id', 'id')
  }

  type() {
    return this.belongsTo('App/Models/ProductType', 'type_id', 'id')
  }

  image() {
    return this.belongsTo('App/Models/Image', 'image_id', 'id')
  }
}

module.exports = Product

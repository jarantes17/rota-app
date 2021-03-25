'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Supply extends Model {
  product() {
    return this.belongsTo('App/Models/Product', 'product_id', 'id')
  }
}

module.exports = Supply

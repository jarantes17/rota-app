'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Budget extends Model {
  supplier() {
    return this.belongsTo('App/Models/Supplier', 'supplier_id', 'id')
  }
}

module.exports = Budget

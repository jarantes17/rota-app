'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class BudgetItem extends Model {
  budget() {
    return this.belongsTo('App/Model/Budget', 'budget_id', 'id')
  }

  product() {
    return this.belongsTo('App/Model/Product', 'product_id', 'id')
  }
}

module.exports = BudgetItem

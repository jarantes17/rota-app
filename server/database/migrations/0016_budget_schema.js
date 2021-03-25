'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BudgetSchema extends Schema {
  up() {
    this.create('budgets', (table) => {
      table.increments()
      table.integer('week').notNullable()
      table
        .integer('supplier_id')
        .unsigned()
        .references('id')
        .inTable('suppliers')
        .notNullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('budgets')
  }
}

module.exports = BudgetSchema

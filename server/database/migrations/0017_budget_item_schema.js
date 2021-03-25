'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BudgetItemSchema extends Schema {
  up() {
    this.create('budget_items', (table) => {
      table.increments()
      table.integer('quantity').notNullable()
      table.double('quoted_price').notNullable()
      table
        .integer('budget_id')
        .unsigned()
        .references('id')
        .inTable('budgets')
        .notNullable()
      table
        .integer('product_id')
        .unsigned()
        .references('id')
        .inTable('products')
        .notNullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('budget_items')
  }
}

module.exports = BudgetItemSchema

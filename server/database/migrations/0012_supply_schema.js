'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SupplySchema extends Schema {
  up() {
    this.create('supplies', (table) => {
      table.increments()
      table.integer('start_quantity').notNullable()
      table.integer('entry_quantity').notNullable()
      table.integer('exit_quantity').notNullable()
      table.date('transaction_date').notNullable()
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
    this.drop('supplies')
  }
}

module.exports = SupplySchema

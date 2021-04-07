'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BillSchema extends Schema {
  up() {
    this.create('bills', (table) => {
      table.increments()
      table.integer('created_by').notNullable()
      table.boolean('payed').notNullable()
      table.double('total_amount').notNullable()
      table
        .integer('order_id')
        .unsigned()
        .references('id')
        .inTable('orders')
        .notNullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('bills')
  }
}

module.exports = BillSchema

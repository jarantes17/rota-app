'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrderSchema extends Schema {
  up() {
    this.create('orders', (table) => {
      table.increments()
      table.boolean('for_delivery').notNullable().defaultTo(false)
      table.string('responsible_name').notNullable()
      table.decimal('total', 12, 2).defaultTo(0.0)
      table
        .enu('status', ['Opened', 'Done', 'Closed', 'Canceled'])
        .defaultTo('Opened')
        .notNullable()
      table
        .integer('customer_id')
        .unsigned()
        .references('id')
        .inTable('customers')
        .nullable()
      table
        .integer('board_id')
        .unsigned()
        .references('id')
        .inTable('boards')
        .nullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('orders')
  }
}

module.exports = OrderSchema

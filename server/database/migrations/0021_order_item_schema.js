'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrderItemSchema extends Schema {
  up() {
    this.create('order_items', (table) => {
      table.increments()
      table.integer('quantity').notNullable()
      table.decimal('subtotal', 12, 2)
      table.string('observation', 100)
      table
        .enu('status', ['Opened', 'Done', 'Closed', 'Canceled'])
        .defaultTo('Opened')
        .notNullable()
      table.date('cancel_date').nullable()
      table.integer('canceled_by').nullable()
      table.integer('created_by').notNullable()
      table
        .integer('order_id')
        .unsigned()
        .references('id')
        .inTable('orders')
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
    this.drop('order_items')
  }
}

module.exports = OrderItemSchema

'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductSchema extends Schema {
  up() {
    this.create('products', (table) => {
      table.increments()
      table.string('code', 10).notNullable()
      table.string('description', 100).notNullable()
      table.double('volume').nullable()
      table.double('purchase_price', 12, 2).nullable()
      table.decimal('resale_price', 12, 2).nullable()
      table.boolean('resale_product').notNullable()
      table.boolean('stock_control').notNullable()
      table.string('status', 1).notNullable()
      table
        .integer('uom_id')
        .unsigned()
        .references('id')
        .inTable('product_uoms')
        .notNullable()
      table
        .integer('type_id')
        .unsigned()
        .references('id')
        .inTable('product_types')
        .notNullable()
      table
        .integer('image_id')
        .unsigned()
        .references('id')
        .inTable('images')
        .onDelete('cascade')
      table.timestamps()
    })
  }

  down() {
    this.drop('products')
  }
}

module.exports = ProductSchema

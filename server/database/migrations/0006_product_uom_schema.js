'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductUomSchema extends Schema {
  up() {
    this.create('product_uoms', (table) => {
      table.increments()
      table.string('code', 3).notNullable()
      table.string('description', 50).notNullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('product_uoms')
  }
}

module.exports = ProductUomSchema

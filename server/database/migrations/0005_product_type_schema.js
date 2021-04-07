'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductTypeSchema extends Schema {
  up() {
    this.create('product_types', (table) => {
      table.increments()
      table.string('type', 50).notNullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('product_types')
  }
}

module.exports = ProductTypeSchema

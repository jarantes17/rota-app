'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SupplierSchema extends Schema {
  up() {
    this.create('suppliers', (table) => {
      table.increments()
      table.string('name', 50).notNullable()
      table.string('city', 50).nullable()
      table.double('freight').nullable()
      table.string('phone', 20).nullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('suppliers')
  }
}

module.exports = SupplierSchema

'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CustomerSchema extends Schema {
  up() {
    this.create('customers', (table) => {
      table.increments()
      table.string('first_name', 50).notNullable()
      table.string('last_name', 50).notNullable()
      table.string('phone', 20).notNullable()
      table
        .integer('address_id')
        .unsigned()
        .references('id')
        .inTable('addresses')
        .notNullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('customers')
  }
}

module.exports = CustomerSchema

'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OutGoingSchema extends Schema {
  up() {
    this.create('out_goings', (table) => {
      table.increments()
      table.string('type', 30).notNullable()
      table.string('description', 100).nullable()
      table.decimal('amount', 12, 2).notNullable()
      table.date('pay_date').notNullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('out_goings')
  }
}

module.exports = OutGoingSchema

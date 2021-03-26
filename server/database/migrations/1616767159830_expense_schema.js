'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExpenseSchema extends Schema {
  up() {
    this.create('expenses', (table) => {
      table.increments()
      table.string('type', 30).notNullable()
      table.string('observation', 100).nullable()
      table.decimal('amount', 12, 2).notNullable()
      table.date('pay_date').notNullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('expenses')
  }
}

module.exports = ExpenseSchema

'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BillPaymentSchema extends Schema {
  up() {
    this.create('bill_payments', (table) => {
      table.increments()
      table.integer('payment_type_id').unsigned().index('payment_type_id')
      table.integer('bill_id').unsigned().index('bill_id')
      table
        .foreign('payment_type_id')
        .references('payment_types.id')
        .onDelete('cascade')
      table.double('amount').nullable()
      table.foreign('bill_id').references('bills.id').onDelete('cascade')
      table.timestamps()
    })
  }

  down() {
    this.drop('bill_payments')
  }
}

module.exports = BillPaymentSchema

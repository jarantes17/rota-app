'use strict'

/*
|--------------------------------------------------------------------------
| PaymentTypeSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Database')} */
const Database = use('Database')

class PaymentTypeSeeder {
  async run() {
    await Database.table('payment_types').insert([
      {
        id: 1,
        name: 'CASH',
        description: 'Dinheiro',
        enabled: true,
        created_at: new Date()
      },
      {
        id: 2,
        name: 'DEBIT_CARD',
        description: 'Cartão de Débito',
        enabled: true,
        created_at: new Date()
      },
      {
        id: 3,
        name: 'CREDIT_CARD',
        description: 'Cartão de Crédito',
        enabled: true,
        created_at: new Date()
      }
    ])
  }
}

module.exports = PaymentTypeSeeder

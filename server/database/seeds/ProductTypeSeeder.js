'use strict'

/*
|--------------------------------------------------------------------------
| ProductTypeSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Database = use('Database')

class ProductTypeSeeder {
  async run() {
    await Database.table('product_types').insert([
      {
        id: 1,
        type: 'Comida',
        created_at: new Date()
      },
      {
        id: 2,
        type: 'Bebida',
        created_at: new Date()
      },
      {
        id: 3,
        type: 'Ingrediente',
        created_at: new Date()
      },
      {
        id: 4,
        type: 'Limpeza',
        created_at: new Date()
      }
    ])
  }
}

module.exports = ProductTypeSeeder

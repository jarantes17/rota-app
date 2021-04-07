'use strict'

/*
|--------------------------------------------------------------------------
| ProductUomSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Database = use('Database')

class ProductUomSeeder {
  async run() {
    await Database.table('product_uoms').insert([
      {
        id: 1,
        code: 'UN',
        description: 'Unidade',
        created_at: new Date()
      },
      {
        id: 2,
        code: 'LT',
        description: 'Litro',
        created_at: new Date()
      },
      {
        id: 3,
        code: 'ML',
        description: 'Mililitro',
        created_at: new Date()
      },
      {
        id: 4,
        code: 'KG',
        description: 'Killograma',
        created_at: new Date()
      },
      {
        id: 5,
        code: 'GR',
        description: 'Grama',
        created_at: new Date()
      }
    ])
  }
}

module.exports = ProductUomSeeder

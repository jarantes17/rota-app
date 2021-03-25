'use strict'

/*
|--------------------------------------------------------------------------
| AdditionSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Database')} */
const Database = use('Database')

class AdditionSeeder {
  async run() {
    await Database.table('additions').insert([
      {
        id: 1,
        description: 'Queijo',
        price: 2.0,
        enabled: true,
        created_at: new Date()
      },
      {
        id: 2,
        description: 'Bacon',
        price: 3.0,
        enabled: true,
        created_at: new Date()
      },
      {
        id: 4,
        description: 'Milho',
        price: 1.5,
        enabled: true,
        created_at: new Date()
      },
      {
        id: 5,
        description: 'Catupíry',
        price: 3.0,
        enabled: true,
        created_at: new Date()
      },
      {
        id: 6,
        description: 'Ervilha',
        price: 1.5,
        enabled: true,
        created_at: new Date()
      },
      {
        id: 7,
        description: 'Azeitona',
        price: 1.5,
        enabled: true,
        created_at: new Date()
      },
      {
        id: 8,
        description: 'Calabresa',
        price: 2.0,
        enabled: true,
        created_at: new Date()
      },
      {
        id: 9,
        description: 'Cheddar',
        price: 3.0,
        enabled: true,
        created_at: new Date()
      }
    ])
  }
}

module.exports = AdditionSeeder

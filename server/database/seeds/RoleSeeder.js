'use strict'

/*
|--------------------------------------------------------------------------
| RoleSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Database')} */
const Database = use('Database')

class RoleSeeder {
  async run() {
    await Database.table('roles').insert([
      {
        id: 1,
        slug: 'ADMIN',
        name: 'Administrador',
        description: 'Administrador do Sistema',
        created_at: new Date()
      },
      {
        id: 2,
        slug: 'MANAGER',
        name: 'Gerente',
        description: 'Gerenciador do Sistema',
        created_at: new Date()
      },
      {
        id: 3,
        slug: 'CASHIER',
        name: 'Caixa',
        description: 'Operador Caixa do Sistema',
        created_at: new Date()
      },
      {
        id: 4,
        slug: 'WAITER',
        name: 'Garçon',
        description: 'Operador Garçon do Sistema',
        created_at: new Date()
      },
      {
        id: 5,
        slug: 'CLIENT',
        name: 'Cliente',
        description: 'Cliente do Restaurante/Food Trailer',
        created_at: new Date()
      }
    ])
  }
}

module.exports = RoleSeeder

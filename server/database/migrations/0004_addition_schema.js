'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AdditionSchema extends Schema {
  up() {
    this.create('additions', (table) => {
      table.increments()
      table.string('description').notNullable()
      table.decimal('price', 12, 2).notNullable()
      table.boolean('enabled').notNullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('additions')
  }
}

module.exports = AdditionSchema

'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FlexFieldSchema extends Schema {
  up() {
    this.create('flex_fields', (table) => {
      table.increments()
      table.string('name', 20).notNullable()
      table.string('value', 30).notNullable()
      table.string('description', 50).notNullable()
      table.enu('status', ['A', 'I']).defaultTo('A').notNullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('flex_fields')
  }
}

module.exports = FlexFieldSchema

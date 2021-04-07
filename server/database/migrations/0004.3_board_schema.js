'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BoardSchema extends Schema {
  up() {
    this.create('boards', (table) => {
      table.increments()
      table.string('code', 3).notNullable()
      table
        .enu('status', ['Free', 'Busy']) // F - Free / B - Busy
        .defaultTo('Free')
        .notNullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('boards')
  }
}

module.exports = BoardSchema

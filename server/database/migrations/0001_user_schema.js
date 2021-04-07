'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up() {
    this.create('users', (table) => {
      table.increments()
      table.string('name', 20).notNullable()
      table.string('surname', 50).notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).nullable()
      table.string('celphone', 16).nullable()
      table
        .enu('status', ['A', 'I']) // A - Activeted / I - Inactive
        .defaultTo('A')
        .notNullable()
      table.string('provider_id').nullable()
      table.string('provider').nullable()
      table.string('expression_validation').unique()
      table.timestamps()
    })
  }

  down() {
    this.drop('users')
  }
}

module.exports = UserSchema

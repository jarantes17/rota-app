'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Module extends Model {
  roles() {
    return this.belongsToMany('App/Models/Role')
  }
}

module.exports = Module

'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Role extends Model {
  modules() {
    return this.belongsToMany('App/Models/Module')
  }
}

module.exports = Role

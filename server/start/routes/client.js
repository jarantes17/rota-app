'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  // Menu
  Route.get('menu', 'MenuController.index').as('menu.index')
})
  .middleware(['auth'])
  .namespace('Client')

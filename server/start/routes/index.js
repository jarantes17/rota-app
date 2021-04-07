'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

// Root
Route.get('/', 'HomeController.index')

require('./auth')
require('./admin')
require('./client')

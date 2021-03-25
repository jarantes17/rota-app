'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

// Auth
Route.group(() => {
  Route.post('/register', 'AuthController.register').as('auth.register')

  Route.post('/login', 'AuthController.login').as('auth.login')
  Route.post('/socialLogin', 'AuthController.socialLogin').as(
    'auth.socialLogin'
  )

  Route.post('/register', 'AuthController.register').as('auth.register')

  Route.post('/changePassword', 'AuthController.changePassword').as(
    'auth.changePassword'
  )

  Route.post('/checkExpression', 'AuthController.checkExpression').as(
    'auth.checkExpression'
  )

  Route.post('/forgotPassword', 'AuthController.forgotPassword').as(
    'auth.forgotPassword'
  )

  Route.post('/refresh', 'AuthController.refresh')
    .middleware(['findRefreshToken'])
    .as('auth.refresh')

  Route.post('/logout', 'AuthController.logout')
    .middleware(['auth', 'findRefreshToken'])
    .as('auth.logout')
})
  .prefix('/auth')
  .namespace('Auth')

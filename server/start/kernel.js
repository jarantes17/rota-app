'use strict'

/** @type {import('@adonisjs/framework/src/Server')} */
const Server = use('Server')

/*
|--------------------------------------------------------------------------
| Global Middleware
|--------------------------------------------------------------------------
|
| Global middleware are executed on each http request only when the routes
| match.
|
*/
const globalMiddleware = [
  'Adonis/Middleware/BodyParser',
  'App/Middleware/ConvertEmptyStringsToNull',
  'Adonis/Acl/Init',
  'App/Middleware/Pagination'
]

/*
|--------------------------------------------------------------------------
| Named Middleware
|--------------------------------------------------------------------------
|
| Named middleware is key/value object to conditionally add middleware on
| specific routes or group of routes.
|
| // define
| {
|   auth: 'Adonis/Middleware/Auth'
| }
|
| // use
| Route.get().middleware('auth')
|
*/
const namedMiddleware = {
  auth: 'Adonis/Middleware/Auth',
  guest: 'Adonis/Middleware/AllowGuestOnly',
  is: 'Adonis/Acl/Is',

  // custom
  findAddition: 'App/Middleware/FindAddition',
  findBoard: 'App/Middleware/FindBoard',
  findPaymentType: 'App/Middleware/FindPaymentType',
  findSupplier: 'App/Middleware/FindSupplier',
  findProduct: 'App/Middleware/FindProduct',
  findProductType: 'App/Middleware/FindProductType',
  findProductUom: 'App/Middleware/FindProductUom',
  findRefreshToken: 'App/Middleware/FindProductUom',
  findUser: 'App/Middleware/FindUser',
  findOrder: 'App/Middleware/FindOrder',
  findBill: 'App/Middleware/FindBill',
  findExpense: 'App/Middleware/FindExpense'
}

/*
|--------------------------------------------------------------------------
| Server Middleware
|--------------------------------------------------------------------------
|
| Server level middleware are executed even when route for a given URL is
| not registered. Features like `static assets` and `cors` needs better
| control over request lifecycle.
|
*/
const serverMiddleware = ['Adonis/Middleware/Static', 'Adonis/Middleware/Cors']

Server.registerGlobal(globalMiddleware)
  .registerNamed(namedMiddleware)
  .use(serverMiddleware)

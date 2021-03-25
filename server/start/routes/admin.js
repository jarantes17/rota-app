'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  // Additions
  Route.resource('additions', 'AdditionController')
    .apiOnly()
    .middleware(new Map([[['show', 'update', 'destroy'], ['findAddition']]]))

  // PaymentTypes
  Route.resource('paymentTypes', 'PaymentTypeController').apiOnly()

  // Suppliers
  Route.resource('suppliers', 'SupplierController')
    .apiOnly()
    .middleware(new Map([[['show', 'update', 'destroy'], ['findSupplier']]]))

  // Boards
  Route.get('boards/busy', 'BoardController.busy')
  Route.put('boards/leave', 'BoardController.leave')
  Route.resource('boards', 'BoardController')
    .apiOnly()
    .middleware(new Map([[['show', 'update', 'destroy'], ['findBoard']]]))

  // Products
  Route.get('products/code', 'ProductController.code')
  Route.resource('products', 'ProductController')
    .apiOnly()
    .middleware(new Map([[['show', 'update', 'destroy'], ['findProduct']]]))

  // ProductTypes
  Route.resource('productTypes', 'ProductTypeController')
    .apiOnly()
    .middleware(new Map([[['show', 'update', 'destroy'], ['findProductType']]]))

  // ProductUoms
  Route.resource('productUoms', 'ProductUomController')
    .apiOnly()
    .middleware(new Map([[['show', 'update', 'destroy'], ['findProductUom']]]))

  // Users
  Route.resource('users', 'UserController')
    .apiOnly()
    .middleware(new Map([[['show', 'update', 'destroy'], ['findUser']]]))

  // Roles
  Route.get('roles', 'RoleController.index')

  // Orders
  Route.get('orders/opened', 'OrderController.opened')
  Route.put('orders/cancel', 'OrderController.cancel')
  Route.resource('orders', 'OrderController')
    .apiOnly()
    .middleware(new Map([[['show', 'update', 'destroy'], ['findOrder']]]))

  // Bills
  Route.get('bills', 'BillController.index').as('bills.index')
  Route.put('bills/:id', 'BillController.update')
    .middleware(['findBill'])
    .as('bills.update')
  Route.put('bills/savePayments', 'BillController.savePayments').as(
    'bills.savePayments'
  )
  Route.get('bills/coupon', 'BillController.coupon').as('bills.coupon')

  Route.get('cash', 'CashController.index').as('cash.index')
})
  .middleware(['auth'])
  .namespace('Admin')

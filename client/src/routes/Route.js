import React from "react"
import { Switch } from "react-router-dom"
import { AdminRoute, AuthRoute, ClientRoute, CommonRoute } from "./index"
import {
  Dashboard,
  Product,
  User,
  Board,
  Budget,
  Revenue,
  Expense,
  Transaction,
  Order,
  Cash,
  Login,
  Register,
  Supplier,
  ChangePassword,
  Main,
  ForgotPassword,
  Menu
} from "../pages"

export const Routes = () => {
  return (
    <Switch>
      {/* admin routes */}
      <AdminRoute path="/admin/dashboard" exact component={Dashboard} />
      <AdminRoute path="/admin/products" exact component={Product} />
      <AdminRoute path="/admin/users" exact component={User} />
      <AdminRoute path="/admin/boards" exact component={Board} />
      <AdminRoute path="/admin/suppliers" exact component={Supplier} />
      <AdminRoute path="/admin/expenses" exact component={Expense} />
      <AdminRoute path="/admin/revenues" exact component={Revenue} />
      <AdminRoute path="/admin/budgets" exact component={Budget} />
      <AdminRoute path="/admin/transactions" exact component={Transaction} />
      <AdminRoute path="/admin/orders" exact component={Order} />
      <AdminRoute path="/admin/cash" component={Cash} />
      {/* client routes */}
      <ClientRoute path="/client/menu" component={Menu} />
      {/* commom routes */}
      <CommonRoute path="/" exact component={Main} />
      {/* auth routes */}
      <AuthRoute path="/login" component={Login} />
      <AuthRoute path="/register" component={Register} />
      <AuthRoute path="/changePassword" component={ChangePassword} />
      <AuthRoute path="/forgotPassword" component={ForgotPassword} />
    </Switch>
  )
}

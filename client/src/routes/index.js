import React from "react"
import { Redirect, Route } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import DefaultLayout from "../pages/_layouts/Default"
import AuthLayout from "../pages/_layouts/Auth"
import EmptyLayout from "../pages/_layouts/Empty"
import ClientLayout from "../pages/_layouts/Client"
import { product } from "../helpers/store/fetchActions/product"
import { auth } from "../helpers/store/fetchActions/auth"

const forceLogout = dispatch => {
  dispatch(auth.logoutAction())
  dispatch(product.clearProductsAction())
}

export const CommonRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useSelector(state => state.auth)

  const roles = useSelector(state => state?.auth?.authData?.user?.roles || [])

  let isClient = false
  if (roles && roles.length === 1) {
    isClient = roles[0].slug === "CLIENT"
  }

  return (
    <Route
      {...rest}
      render={props =>
        !isAuthenticated ? (
          <EmptyLayout>
            <Component {...props} />
          </EmptyLayout>
        ) : (
          <Redirect
            to={{
              pathname: !isClient ? "/admin/start" : "/client/menu",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  )
}

export const AuthRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useSelector(state => state.auth)

  const roles = useSelector(state => state?.auth?.authData?.user?.roles || [])

  let isClient = false
  if (roles && roles.length === 1) {
    isClient = roles[0].slug === "CLIENT"
  }

  return (
    <Route
      {...rest}
      render={props =>
        !isAuthenticated ? (
          <AuthLayout>
            <Component {...props} />
          </AuthLayout>
        ) : (
          <Redirect
            to={{
              pathname: !isClient ? "/admin/start" : "/client/menu",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  )
}

export const ClientRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useSelector(state => state.auth)

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <ClientLayout>
            <Component {...props} />
          </ClientLayout>
        ) : (
          <Redirect to="/login?type=CLIENT" />
        )
      }
    />
  )
}

export const AdminRoute = ({ component: Component, ...rest }) => {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector(state => state.auth)
  const { accesses } = useSelector(state => state?.auth?.authData || [])

  return (
    <Route
      {...rest}
      render={props => {
        const path = props.location.pathname
        if (
          accesses?.filter(m => m.path === path).length === 0 &&
          accesses?.filter(m => m?.subModules?.find(sm => sm.path === path))
            .length === 0
        ) {
          forceLogout(dispatch)

          toast.warning(
            `Oops.. Usuário sem permissão de acesso ao módulo ${path}`
          )

          return <Redirect to="/login?type=ADMIN" />
        }
        return isAuthenticated ? (
          <DefaultLayout>
            <Component {...props} />
          </DefaultLayout>
        ) : (
          <Redirect to="/login?type=ADMIN" />
        )
      }}
    />
  )
}

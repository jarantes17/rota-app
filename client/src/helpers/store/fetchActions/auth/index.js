import { login, logout } from "../../ducks/auth"

const loginAction = authData => {
  return dispatch => {
    dispatch(login(authData))
  }
}

const logoutAction = () => {
  return dispatch => {
    dispatch(logout())
  }
}

export const auth = {
  loginAction,
  logoutAction
}

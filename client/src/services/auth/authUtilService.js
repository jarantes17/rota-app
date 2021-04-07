import { store, persistor } from "../../helpers"

const getAuthData = () => {
  const {
    auth: { authData = {} }
  } = store.getState()
  return authData
}

const getUserData = () => {
  const authData = getAuthData() || {}
  return authData?.user
}

const getUserRole = () => {
  const userData = getUserData() || {}
  return userData?.user?.role?.authority
}

const getToken = () => {
  const authData = getAuthData() || {}
  return authData?.token?.token
}

const resetAuthData = () => persistor.purge()

const authUtilService = {
  getAuthData,
  getToken,
  getUserRole,
  getUserData,
  resetAuthData
}

export default authUtilService

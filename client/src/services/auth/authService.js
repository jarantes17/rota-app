import api from "../api"

const path = "/auth"

const login = async ({ email, password }) =>
  api.post(`${path}/login`, { email, password })

const socialLogin = async data => api.post(`${path}/socialLogin`, { data })

const register = async data => api.post(`${path}/register`, data)

const logout = async () => api.post(`${path}/logout`)

const changePassword = async ({ newPassword, expression }) =>
  api.post(`${path}/changePassword`, { newPassword, expression })

const forgotPassowrd = async ({ email }) =>
  api.post(`${path}/forgotPassword`, { email })

const checkExpression = async expression =>
  api.post(`${path}/checkExpression`, { expression })

const authService = {
  login,
  socialLogin,
  register,
  logout,
  changePassword,
  forgotPassowrd,
  checkExpression
}

export default authService

import axios from "axios"
import authService from "./auth/authUtilService"

const httpClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  }
})

httpClient.interceptors.request.use(
  async config => {
    const token = await authService.getToken()
    const response = config

    response.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`
    }
    return response
  },
  err => {
    const token = authService.getToken()
    if (token && err.response.status === 401) {
      localStorage.clear()
      window.location.reload()
    }
    return Promise.reject(err)
  }
)

export default httpClient

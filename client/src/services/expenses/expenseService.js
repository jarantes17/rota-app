import api from "../api"

const path = "/expenses"

const fetch = async () => api.get(`${path}`)

const detail = async id => api.get(`${path}/${id}`)

const store = async (data, config) => api.post(`${path}`, data, config)

const update = async (id, data = {}) => api.put(`${path}/${id}`, { ...data })

const remove = async id => api.delete(`${path}/${id}`)

const expenseService = {
  fetch,
  detail,
  store,
  update,
  remove
}

export default expenseService

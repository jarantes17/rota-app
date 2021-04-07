import api from "../api"

const path = "/orders"

const fetch = async () => api.get(`${path}`)

const detail = async id => api.get(`${path}/${id}`)

const store = async (data, config) => api.post(`${path}`, data, config)

const update = async (id, data = {}) => api.put(`${path}/${id}`, { ...data })

const remove = async id => api.delete(`${path}/${id}`)

const opened = async () => api.get(`${path}/opened`)

const cancel = async data => api.put(`${path}/cancel`, { ...data })

const orderService = {
  fetch,
  detail,
  store,
  update,
  remove,
  opened,
  cancel
}

export default orderService

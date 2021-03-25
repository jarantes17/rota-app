import api from "../api"

const path = "/boards"

const fetch = async () => api.get(`${path}`)

const detail = async id => api.get(`${path}/${id}`)

const store = async (data, config) => api.post(`${path}`, data, config)

const update = async (id, data = {}) => api.put(`${path}/${id}`, { ...data })

const remove = async id => api.delete(`${path}/${id}`)

const busy = async () => api.get(`${path}/busy`)

const leave = async (data, config) => api.put(`${path}/leave`, data)

const boardService = {
  fetch,
  detail,
  store,
  update,
  remove,
  busy,
  leave
}

export default boardService

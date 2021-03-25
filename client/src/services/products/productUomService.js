import api from "../api"

const path = "/productUoms"

const fetch = async () => api.get(`${path}`)

const detail = async id => api.get(`${path}/${id}`)

const store = async (data = {}) => api.post(`${path}`, { ...data })

const update = async (id, data = {}) => api.put(`${path}/${id}`, { ...data })

const remove = async id => api.delete(`${path}/${id}`)

const productUomService = {
  fetch,
  detail,
  store,
  update,
  remove
}

export default productUomService

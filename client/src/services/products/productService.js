import api from "../api"

const path = "/products"

const fetch = async () => api.get(`${path}`)

const fetchResale = async () => api.get(`${path}?resale_product=true`)

const detail = async id => api.get(`${path}/${id}`)

const store = async (data, config) => api.post(`${path}`, data, config)

const update = async (id, data = {}) => api.put(`${path}/${id}`, { ...data })

const remove = async id => api.delete(`${path}/${id}`)

const getProductCode = async => api.get(`${path}/code`)

const productService = {
  fetch,
  fetchResale,
  detail,
  store,
  update,
  remove,
  getProductCode
}

export default productService

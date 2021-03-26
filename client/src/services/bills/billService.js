import api from "../api"

const path = "/bills"

const fetch = async orderId => api.get(`${path}?order_id=${orderId}`)

const update = async (id, data = {}) => api.put(`${path}/${id}`, { ...data })

const savePayments = async (data = {}) =>
  api.patch(`${path}/savePayments`, { ...data })

const coupon = async id => api.get(`${path}/coupon/${id}`)

const billService = {
  fetch,
  update,
  coupon,
  savePayments
}

export default billService

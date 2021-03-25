import api from "../api"

const path = "/paymentTypes"

const fetch = async () => api.get(`${path}`)

const paymentTypeService = {
  fetch
}

export default paymentTypeService

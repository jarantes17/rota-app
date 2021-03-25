import api from "../api"

const path = "/cash"

const fetch = async cashDate => api.get(`${path}?cash_date=${cashDate}`)

const cashService = {
  fetch
}

export default cashService

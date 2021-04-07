import api from "../api"

const path = "/transactions"

const fetch = async () => api.get(`${path}`)

const transactionService = {
  fetch
}

export default transactionService

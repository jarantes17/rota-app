import api from "../api"

const path = "/menu"

const fetch = async () => api.get(`${path}`)

const menuService = {
  fetch
}

export default menuService

import api from "../api"

const path = "/roles"

const fetch = async () => api.get(`${path}`)

const roleService = {
  fetch
}

export default roleService

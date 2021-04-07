import api from "../api"

const path = "/reports"
const expenseRevenue = async (month, year) =>
  api.get(`${path}/expenseRevenue?month=${month}&&year=${year}`)

const resumeInfo = async () => api.get(`${path}/resumeInfo`)

const reportService = {
  expenseRevenue,
  resumeInfo
}

export default reportService

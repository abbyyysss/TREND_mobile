// services/dashboardService.js
import api from "./Api";

export async function fetchDashboardData(params = {}) {
  try {
    const res = await api.get("/dashboard/", { params });
    console.log(res);
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching dashboard data:", error);
    throw error;
  }
}

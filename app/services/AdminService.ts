import axios from "axios";

// Ensure this matches your backend: e.g., https://your-api.com/api/v1
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 1. Create a specialized Axios instance for Admin
const adminApi = axios.create({
  baseURL: `${BASE_URL}/admin`,
});

// 2. Request Interceptor: Automatically attach the token to all admin calls
adminApi.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor: Handle 401/403 globally (Optional but helpful)
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error("Admin Authentication Error: Redirecting to login...");
      // Optional: window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// -------------------- Admin Services --------------------

export const getPendingDoctors = async () => {
  const { data } = await adminApi.get("/doctors/pending");
  return data?.data || [];
};

export const updateDoctorStatusService = async (doctorId: string, status: string) => {
  const { data } = await adminApi.put(`/doctors/${doctorId}`, { status });
  return data?.data;
};

export const getAllDoctors = async () => {
  const { data } = await adminApi.get("/doctors");
  return data?.data || [];
};

export const getAllUsers = async () => {
  const { data } = await adminApi.get("/users");
  return data?.data || [];
};

export const getAUser = async (userId: string) => {
  const { data } = await adminApi.get(`/user/${userId}`);
  return data?.data;
};

export const getAllAdmins = async () => {
    const { data } = await adminApi.get("/allAdmins");
    return data?.data || [];
};

/**
 * Combined User & Doctor Growth Analytics
 * @param months - Number of months to fetch data for
 */
export const getCombinedGrowthService = async (months: number = 1) => {
  const { data } = await adminApi.get(`/combinedGrowth`, {
    params: { months }
  });
  
  // Note: We return the whole data object here because analytics usually 
  // contain multiple keys (monthlyGrowth, weeklyGrowth, etc.)
  return data?.data || data;
};

export default {
  getPendingDoctors,
  updateDoctorStatusService,
  getAllDoctors,
  getAllUsers,
  getAUser,
  getAllAdmins,
  getCombinedGrowthService
};
// services/adminService.ts - UPDATED FRONTEND
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ==================== Admin API Instance ====================
const adminApi = axios.create({
  baseURL: `${BASE_URL}/admin`,
});

// ==================== REQUEST INTERCEPTOR ====================
// Automatically attach token to every request
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔑 [adminApi] Token attached to request");
    } else {
      console.warn("⚠️ [adminApi] No token found in localStorage");
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==================== RESPONSE INTERCEPTOR ====================
// Handle 401 errors and token refresh
adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      console.log("🔄 [adminApi] 401 error - attempting token refresh");
      
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        
        if (!refreshToken) {
          console.error("❌ [adminApi] No refresh token available");
          throw new Error("No refresh token");
        }
        
        // Call your refresh endpoint
        const { data } = await axios.post(`${BASE_URL}/auth/refreshToken`, { 
          refreshToken 
        });
        
        if (data.success && data.token) {
          console.log("✅ [adminApi] Token refreshed successfully");
          
          // Save new access token
          localStorage.setItem("token", data.token);
          
          // Update the header and retry the original request
          originalRequest.headers.Authorization = `Bearer ${data.token}`;
          return adminApi(originalRequest);
        }
      } catch (refreshError) {
        console.error("❌ [adminApi] Token refresh failed:", refreshError);
        
        // Clear storage and redirect to login
        localStorage.clear();
        window.location.href = "/adminLogin";
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 (Forbidden) errors
    if (error.response?.status === 403) {
      console.error("❌ [adminApi] 403 Forbidden - Insufficient permissions");
      // Optionally redirect or show error message
    }

    return Promise.reject(error);
  }
);

// ==================== ADMIN AUTH SERVICES ====================

export const registerAdminService = async (adminData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const { data } = await axios.post(`${BASE_URL}/admin/adminRegister`, adminData);
  
  if (data.success && data.data.token) {
    localStorage.setItem("token", data.data.token);
    console.log("✅ [registerAdminService] Token saved to localStorage");
  }
  
  return data?.data;
};

export const loginAdminService = async (credentials: {
  email: string;
  password: string;
}) => {
  const { data } = await axios.post(`${BASE_URL}/admin/adminLogin`, credentials);
  
  if (data.success && data.data.token) {
    localStorage.setItem("token", data.data.token);
    console.log("✅ [loginAdminService] Token saved to localStorage");
  }
  
  return data?.data;
};

// ==================== ADMIN DASHBOARD SERVICES ====================

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
  
  return data?.data || data;
};

// ==================== UTILITY FUNCTIONS ====================

export const isAdminAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};

export const logoutAdmin = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  console.log("✅ [logoutAdmin] Admin logged out");
};

// ==================== EXPORTS ====================
export default {
  registerAdminService,
  loginAdminService,
  getPendingDoctors,
  updateDoctorStatusService,
  getAllDoctors,
  getAllUsers,
  getAUser,
  getAllAdmins,
  getCombinedGrowthService,
  isAdminAuthenticated,
  logoutAdmin,
};
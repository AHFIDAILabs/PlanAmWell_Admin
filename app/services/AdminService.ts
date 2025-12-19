import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;



const adminPartnerApi = axios.create({
  baseURL: `${BASE_URL}/partners`,
});

// ==================== REQUEST INTERCEPTOR ====================
adminPartnerApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// ==================== RESPONSE INTERCEPTOR ====================
adminPartnerApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post(`${BASE_URL}/auth/refreshToken`, { refreshToken });

        if (data.success && data.token) {
          localStorage.setItem("token", data.token);
          originalRequest.headers.Authorization = `Bearer ${data.token}`;
          return adminPartnerApi(originalRequest);
        }
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/adminLogin";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);


// ==================== Admin API Instance ====================
const adminApi = axios.create({
  baseURL: `${BASE_URL}/admin`,
});

// ==================== REQUEST INTERCEPTOR ====================
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
  (error) => Promise.reject(error)
);

// ==================== RESPONSE INTERCEPTOR ====================
adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.log("🔄 [adminApi] 401 error - attempting token refresh");

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post(`${BASE_URL}/auth/refreshToken`, { refreshToken });

        if (data.success && data.token) {
          localStorage.setItem("token", data.token);
          originalRequest.headers.Authorization = `Bearer ${data.token}`;
          return adminApi(originalRequest);
        }
      } catch (refreshError) {
        console.error("❌ [adminApi] Token refresh failed:", refreshError);
        localStorage.clear();
        window.location.href = "/adminLogin";
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 403) {
      console.error("❌ [adminApi] 403 Forbidden - Insufficient permissions");
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
  if (data.success && data.data.token) localStorage.setItem("token", data.data.token);
  return data?.data;
};

export const loginAdminService = async (credentials: { email: string; password: string }) => {
  const { data } = await axios.post(`${BASE_URL}/admin/adminLogin`, credentials);
  if (data.success && data.data.token) localStorage.setItem("token", data.data.token);
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

export const getCombinedGrowthService = async (months: number = 1) => {
  const { data } = await adminApi.get(`/combinedGrowth`, { params: { months } });
  return data?.data || data;
};

// ==================== ADMIN PARTNER SERVICES ====================
export const getAllPartnersService = async () => {
  const { data } = await adminPartnerApi.get("/");
  return data?.data || [];
};

export const getPartnerByIdService = async (partnerId: string) => {
  const { data } = await adminPartnerApi.get(`/${partnerId}`);
  return data?.data;
};

export const createPartnerService = async (formData: FormData) => {
  const { data } = await adminPartnerApi.post("/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data?.data;
};

export const updatePartnerService = async (partnerId: string, formData: FormData) => {
  const { data } = await adminPartnerApi.put(`/${partnerId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data?.data;
};

export const deletePartnerService = async (partnerId: string) => {
  const { data } = await adminPartnerApi.delete(`/${partnerId}`);
  return data?.data;
};

export const togglePartnerStatusService = async (partnerId: string) => {
  const { data } = await adminPartnerApi.patch(`/${partnerId}/toggle-status`);
  return data?.data;
};

export const getPartnerStatsService = async () => {
  const { data } = await adminPartnerApi.get("/stats");
  return data?.data;
};

// ==================== UTILITY FUNCTIONS ====================
export const isAdminAuthenticated = (): boolean => !!localStorage.getItem("token");

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
  // Partner Services
  getAllPartnersService,
  getPartnerByIdService,
  createPartnerService,
  updatePartnerService,
  deletePartnerService,
  togglePartnerStatusService,
  getPartnerStatsService,
};

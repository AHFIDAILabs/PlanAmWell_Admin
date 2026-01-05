import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ==================== Admin API Instance ====================
const adminApi = axios.create({
  baseURL: `${BASE_URL}`,
});

// ==================== REQUEST INTERCEPTOR ====================
adminApi.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log(" [adminApi] Token attached to request");
      } else {
        console.warn(" [adminApi] No token found in localStorage");
      }
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

    // Only run client-side
    if (typeof window === "undefined") return Promise.reject(error);

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
    
    // ONLY redirect if we aren't already on the login page
    if (typeof window !== "undefined" && !window.location.pathname.includes("/auth/login")) {
        window.location.assign("/auth/login");
    }
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
  const { data } = await adminApi.get("/admin/doctors/pending");
  return data?.data || [];
};

export const updateDoctorStatusService = async (doctorId: string, status: string) => {
  const { data } = await adminApi.put(`/admin/doctors/${doctorId}`, { status });
  return data?.data;
};

export const getAllDoctors = async () => {
  const { data } = await adminApi.get("/admin/doctors");
  return data?.data || [];
};

export const getAllUsers = async () => {
  const { data } = await adminApi.get("/admin/users");
  return data?.data || [];
};

export const getAUser = async (userId: string) => {
  const { data } = await adminApi.get(`admin/user/${userId}`);
  return data?.data;
};

export const getAllAdmins = async () => {
  const { data } = await adminApi.get("admin/allAdmins");
  return data?.data || [];
};

export const getCombinedGrowthService = async (months: number = 1) => {
  const { data } = await adminApi.get(`admin/combinedGrowth`, { params: { months } });
  return data?.data || data;
};

// ==================== ADMIN PARTNER SERVICES ====================
// Use adminApi with /partners prefix (assuming routes are under /admin)
export const getAllPartnersService = async () => {
  try {
    console.log("📡 Fetching all partners...");
    const { data } = await adminApi.get("/partners/");
    console.log("✅ Partners response:", data);
    return data?.data || [];
  } catch (error: any) {
    console.error("❌ getAllPartnersService error:", error.response?.data || error);
    throw error;
  }
};

export const getPartnerByIdService = async (partnerId: string) => {
  try {
    console.log("📡 Fetching partner:", partnerId);
    const { data } = await adminApi.get(`/partners/${partnerId}`);
    console.log("✅ Partner response:", data);
    return data?.data;
  } catch (error: any) {
    console.error("❌ getPartnerByIdService error:", error.response?.data || error);
    throw error;
  }
};

export const createPartnerService = async (formData: FormData) => {
  try {
    console.log("📡 Creating partner...");
    
    // Log what we're sending
    console.log("FormData entries:");
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
    }

    const { data } = await adminApi.post("/partners/", formData, {
      headers: { 
        "Content-Type": "multipart/form-data",
      },
    });
    
    console.log("✅ Create partner response:", data);
    return data?.data;
  } catch (error: any) {
    console.error("❌ createPartnerService error:", error.response?.data || error);
    console.error("Error status:", error.response?.status);
    console.error("Error headers:", error.response?.headers);
    throw error;
  }
};

export const updatePartnerService = async (partnerId: string, formData: FormData) => {
  try {
    console.log("📡 Updating partner:", partnerId);
    const { data } = await adminApi.put(`/partners/${partnerId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("✅ Update partner response:", data);
    return data?.data;
  } catch (error: any) {
    console.error("❌ updatePartnerService error:", error.response?.data || error);
    throw error;
  }
};

export const deletePartnerService = async (partnerId: string) => {
  try {
    console.log("📡 Deleting partner:", partnerId);
    const { data } = await adminApi.delete(`/partners/${partnerId}`);
    console.log("✅ Delete partner response:", data);
    return data?.data;
  } catch (error: any) {
    console.error("❌ deletePartnerService error:", error.response?.data || error);
    throw error;
  }
};

export const togglePartnerStatusService = async (partnerId: string) => {
  try {
    console.log("📡 Toggling partner status:", partnerId);
    const { data } = await adminApi.patch(`/partners/${partnerId}/toggle-status`);
    console.log("✅ Toggle status response:", data);
    return data?.data;
  } catch (error: any) {
    console.error("❌ togglePartnerStatusService error:", error.response?.data || error);
    throw error;
  }
};

export const getPartnerStatsService = async () => {
  try {
    console.log("📡 Fetching partner stats...");
    const { data } = await adminApi.get("/partners/stats");
    console.log("✅ Partner stats response:", data);
    return data?.data;
  } catch (error: any) {
    console.error("❌ getPartnerStatsService error:", error.response?.data || error);
    throw error;
  }
};

// ==================== UTILITY FUNCTIONS ====================
export const isAdminAuthenticated = (): boolean => !!localStorage.getItem("token");

export const logoutAdmin = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  console.log("✅ [logoutAdmin] Admin logged out");
};


/**
 * Get all orders for a specific partner
 */
export const getPartnerOrdersService = async (partnerId: string) => {
  try {
    console.log("📡 Fetching orders for partner:", partnerId);
    const { data } = await adminApi.get(`/partners/${partnerId}/orders`);
    console.log("✅ Partner orders response:", data);
    return data?.data || [];
  } catch (error: any) {
    console.error("❌ getPartnerOrdersService error:", error.response?.data || error);
    throw error;
  }
};

/**
 * Get commission report for a specific partner by month/year
 */
export const getPartnerCommissionReportService = async (
  partnerId: string,
  year: number,
  month: number
) => {
  try {
    console.log(`📡 Fetching commission report for partner: ${partnerId}, ${year}-${month}`);
    const { data } = await adminApi.get(`/partners/${partnerId}/commission`, {
      params: { year, month },
    });
    console.log("✅ Commission report response:", data);
    return data?.data || [];
  } catch (error: any) {
    console.error("❌ getPartnerCommissionReportService error:", error.response?.data || error);
    throw error;
  }
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
  getPartnerOrdersService,
  getPartnerCommissionReportService,
};
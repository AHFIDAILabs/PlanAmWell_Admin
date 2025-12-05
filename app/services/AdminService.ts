// services/AdminService.ts
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// -------------------- Existing services --------------------
export const getPendingDoctors = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No admin token found");

  const { data } = await axios.get(`${BASE_URL}/admin/doctors/pending`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data?.data || [];
};

export const updateDoctorStatusService = async (doctorId: string, status: string) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No admin token found");

  const { data } = await axios.put(
    `${BASE_URL}/admin/doctors/${doctorId}`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return data?.data;
};

export const getAllDoctors = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No admin token found");

  const { data } = await axios.get(`${BASE_URL}/admin/doctors`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data.data;
};

export const getAllUsers = async () => {
  const token = localStorage.getItem("token") || "";
  const res = await axios.get(`${BASE_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

export const getAUser = async (userId: string, token?: string) => {
  if (!token) token = localStorage.getItem("token") || "";
  if (!token) throw new Error("No admin token found");

  const res = await axios.get(`${BASE_URL}/admin/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data.data;
};

// -------------------- NEW: Combined User & Doctor Growth --------------------
export const getCombinedGrowthService = async (months: number = 1) => {
  const token = localStorage.getItem("token") || "";
  if (!token) throw new Error("No admin token found");

  const { data } = await axios.get(`${BASE_URL}/admin/combinedGrowth?months=${months}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data; // Returns totalUsers, totalDoctors, growth metrics, monthlyGrowth, weeklyGrowth, etc.
};

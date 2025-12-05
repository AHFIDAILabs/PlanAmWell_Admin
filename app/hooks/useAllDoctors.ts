// hooks/useAllDoctors.ts
import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const useAllDoctors = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    try {
      const { data } = await axios.get(`${BASE_URL}/admin/doctors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(data.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  const updateDoctorStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    setError(null);
    const token = localStorage.getItem("token");
    try {
      const { data } = await axios.put(
        `${BASE_URL}/admin/doctors/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update state with updated doctor
      setDoctors((prev) =>
        prev.map((doc) => (doc._id === id ? data.data : doc))
      );
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to update doctor status");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return { doctors, loading, updatingId, error, fetchDoctors, updateDoctorStatus };
};

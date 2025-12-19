// hooks/usePartner.ts
import { useState, useEffect, useCallback } from "react";
import {
  getAllPartnersService,
  getPartnerByIdService,
  createPartnerService,
  updatePartnerService,
  deletePartnerService,
  togglePartnerStatusService,
  getPartnerStatsService,
} from "../services/AdminService";

export interface Partner {
  _id: string;
  name: string;
  logo?: string;
  website?: string;
  status?: "active" | "inactive";
  [key: string]: any;
}

interface UsePartnerHook {
  partners: Partner[];
  loading: boolean;
  error: string | null;
  stats: any;

  fetchAllPartners: () => Promise<void>;
  fetchPartnerById: (id: string) => Promise<Partner | null>;
  createPartner: (formData: FormData) => Promise<Partner | null>;
  updatePartner: (id: string, formData: FormData) => Promise<Partner | null>;
  deletePartner: (id: string) => Promise<boolean>;
  togglePartnerStatus: (id: string) => Promise<Partner | null>;
  fetchPartnerStats: () => Promise<any>;
}

export const usePartner = (): UsePartnerHook => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

const fetchAllPartners = useCallback(async () => {
  setLoading(true);
  setError(null);
  try {
    const data = await getAllPartnersService();
    setPartners(data || []); // <-- default to empty array
  } catch (err: any) {
    console.error("[usePartner] fetchAllPartners error:", err);
    setError(err.message || "Failed to fetch partners");
  } finally {
    setLoading(false);
  }
}, []);


  const fetchPartnerById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPartnerByIdService(id);
      return data;
    } catch (err: any) {
      console.error("[usePartner] fetchPartnerById error:", err);
      setError(err.message || "Failed to fetch partner");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPartner = useCallback(async (formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const newPartner = await createPartnerService(formData);
      setPartners((prev) => [...prev, newPartner]);
      return newPartner;
    } catch (err: any) {
      console.error("[usePartner] createPartner error:", err);
      setError(err.message || "Failed to create partner");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePartner = useCallback(async (id: string, formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPartner = await updatePartnerService(id, formData);
      setPartners((prev) =>
        prev.map((p) => (p._id === id ? updatedPartner : p))
      );
      return updatedPartner;
    } catch (err: any) {
      console.error("[usePartner] updatePartner error:", err);
      setError(err.message || "Failed to update partner");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePartner = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deletePartnerService(id);
      setPartners((prev) => prev.filter((p) => p._id !== id));
      return true;
    } catch (err: any) {
      console.error("[usePartner] deletePartner error:", err);
      setError(err.message || "Failed to delete partner");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const togglePartnerStatus = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPartner = await togglePartnerStatusService(id);
      setPartners((prev) =>
        prev.map((p) => (p._id === id ? updatedPartner : p))
      );
      return updatedPartner;
    } catch (err: any) {
      console.error("[usePartner] togglePartnerStatus error:", err);
      setError(err.message || "Failed to toggle status");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPartnerStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPartnerStatsService();
      setStats(data);
      return data;
    } catch (err: any) {
      console.error("[usePartner] fetchPartnerStats error:", err);
      setError(err.message || "Failed to fetch stats");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    partners,
    loading,
    error,
    stats,
    fetchAllPartners,
    fetchPartnerById,
    createPartner,
    updatePartner,
    deletePartner,
    togglePartnerStatus,
    fetchPartnerStats,
  };
};

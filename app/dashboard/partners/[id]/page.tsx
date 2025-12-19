"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePartner, Partner } from "../../../hooks/usePartner";
import { Box, Typography, TextField, Button, CircularProgress } from "@mui/material";
import PartnerForm from "../../../components/PartnerForm";
import toast from "react-hot-toast";

const PartnerDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { fetchPartnerById, updatePartner, togglePartnerStatus, deletePartner } = usePartner();

  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState({ name: "", website: "", logo: null as File | null });

  useEffect(() => {
    if (!id) return;

    const loadPartner = async () => {
      setLoading(true);
      try {
const partnerId = Array.isArray(id) ? id[0] : id;
const data = await fetchPartnerById(partnerId);
        if (data) {
          setPartner(data);
          setFormData({
            name: data.name || "",
            website: data.website || "",
            logo: null,
          });
        }
      } catch (err) {
        toast.error("Failed to load partner");
      } finally {
        setLoading(false);
      }
    };

    loadPartner();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "logo" && files) {
      setFormData((prev) => ({ ...prev, logo: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!partner) return;
    const data = new FormData();
    data.append("name", formData.name);
    data.append("website", formData.website);
    if (formData.logo) data.append("logo", formData.logo);

    try {
      await updatePartner(partner._id, data);
      toast.success("Partner updated successfully");
    } catch {
      toast.error("Failed to update partner");
    }
  };

  const handleDelete = async () => {
    if (!partner) return;
    if (!confirm("Are you sure you want to delete this partner?")) return;

    try {
      await deletePartner(partner._id);
      toast.success("Partner deleted successfully");
      router.push("/admin/partners");
    } catch {
      toast.error("Failed to delete partner");
    }
  };

  const handleToggleStatus = async () => {
    if (!partner) return;
    try {
      await togglePartnerStatus(partner._id);
      toast.success("Partner status updated");
    } catch {
      toast.error("Failed to toggle status");
    }
  };

  if (loading) return <CircularProgress />;

  if (!partner) return <Typography>Partner not found</Typography>;

  return (
<Box p={4}>
  <Typography variant="h4" mb={2}>Partner Details</Typography>
  <PartnerForm
    initialData={partner}
    onSubmit={handleSubmit} // updatePartner wrapped inside handleSubmit
  />
  <Box mt={2} display="flex" gap={2}>
    <Button variant="outlined" color="warning" onClick={handleToggleStatus}>
      {partner.status === "active" ? "Deactivate" : "Activate"}
    </Button>
    <Button variant="outlined" color="secondary" onClick={handleDelete}>
      Delete
    </Button>
  </Box>
</Box>
  );
};

export default PartnerDetailPage;

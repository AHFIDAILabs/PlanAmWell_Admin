// app/admin/partners/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { usePartner, Partner } from "../../hooks/usePartner";
import PartnerForm from "../../components/PartnerForm";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Modal,
  TextField,
} from "@mui/material"; 
import Toast, { toast } from "react-hot-toast";

const AdminPartnersPage = () => {
  const {
    partners,
    loading,
    error,
    fetchAllPartners,
    createPartner,
    updatePartner,
    deletePartner,
    togglePartnerStatus,
  } = usePartner();

  const [openModal, setOpenModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    logo: null as File | null,
  });

  useEffect(() => {
    fetchAllPartners();
  }, []);

  const handleOpenModal = (partner?: Partner) => {
    if (partner) {
      setEditingPartner(partner);
      setFormData({
        name: partner.name || "",
        website: partner.website || "",
        logo: null,
      });
    } else {
      setEditingPartner(null);
      setFormData({ name: "", website: "", logo: null });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "logo" && files) {
      setFormData((prev) => ({ ...prev, logo: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("website", formData.website);
    if (formData.logo) data.append("logo", formData.logo);

    try {
      if (editingPartner) {
        await updatePartner(editingPartner._id, data);
        Toast.success("Partner updated successfully");
      } else {
        await createPartner(data);
        Toast.success("Partner created successfully");
      }
      fetchAllPartners();
      handleCloseModal();
    } catch (err) {
      Toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this partner?")) return;
    await deletePartner(id);
    Toast.success("Partner deleted successfully");
    fetchAllPartners();
  };

  const handleToggleStatus = async (id: string) => {
    await togglePartnerStatus(id);
    Toast.success("Partner status updated");
    fetchAllPartners();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin - Partners</h1>
      <Button variant="contained" color="primary" onClick={() => handleOpenModal()}>
        Add New Partner
      </Button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <Table style={{ marginTop: "20px" }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Website</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {partners.map((partner) => (
            <TableRow key={partner._id}>
              <TableCell>{partner.name}</TableCell>
              <TableCell>
                <a href={partner.website} target="_blank">
                  {partner.website}
                </a>
              </TableCell>
              <TableCell>{partner.status || "inactive"}</TableCell>
              <TableCell>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleOpenModal(partner)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="secondary"
                  variant="outlined"
                  onClick={() => handleDelete(partner._id)}
                  style={{ marginLeft: "8px" }}
                >
                  Delete
                </Button>
                <Button
                  size="small"
                  color="warning"
                  variant="outlined"
                  onClick={() => handleToggleStatus(partner._id)}
                  style={{ marginLeft: "8px" }}
                >
                  Toggle Status
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

<Modal open={openModal} onClose={handleCloseModal}>
  <div
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "#fff",
      padding: "20px",
      borderRadius: "8px",
      width: "400px",
    }}
  >
    <h2>{editingPartner ? "Edit Partner" : "Add New Partner"}</h2>
    <PartnerForm
      initialData={editingPartner || undefined}
      onCancel={handleCloseModal}
      onSubmit={async (data) => {
        if (editingPartner) {
          await updatePartner(editingPartner._id, data);
          toast.success("Partner updated successfully");
        } else {
          await createPartner(data);
          toast.success("Partner created successfully");
        }
        fetchAllPartners();
        handleCloseModal();
      }}
    />
  </div>
</Modal>
    </div>
  );
};

export default AdminPartnersPage;

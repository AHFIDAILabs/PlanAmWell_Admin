"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePartner } from "../../../../hooks/usePartner";
import { Partner } from "../../../../types/partner";
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Building2, 
  User, 
  Trash2, 
  Save,
  ToggleLeft,
  ToggleRight 
} from "lucide-react";

export default function PartnerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { fetchPartnerById, updatePartner, togglePartnerStatus, deletePartner, loading } = usePartner();

  const [partner, setPartner] = useState<Partner | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profession: "",
    businessAddress: "",
    description: "",
    website: "",
    partnerType: "business" as "individual" | "business" | string,
    isActive: true,
  });

  const [socialLinks, setSocialLinks] = useState<string[]>([""]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Get partner ID from params
  const partnerId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    const loadPartner = async () => {
      if (!partnerId) return;

      setPageLoading(true);
      try {
        const data = await fetchPartnerById(partnerId);
        if (data) {
          setPartner(data);
          
          // Populate form with partner data
          setFormData({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            profession: data.profession || "",
            businessAddress: data.businessAddress || "",
            description: data.description || "",
            website: data.website || "",
            partnerType: data.partnerType || "business" || "",
            isActive: data.isActive !== undefined ? data.isActive : true,
          });

          // Set social links
          if (data.socialLinks && Array.isArray(data.socialLinks) && data.socialLinks.length > 0) {
            setSocialLinks(data.socialLinks);
          } else {
            setSocialLinks([""]);
          }

          // Set image preview if exists
          if (data.partnerImage?.imageUrl || data.partnerImage?.url) {
            setImagePreview(data.partnerImage.imageUrl || data.partnerImage.url || null);
          }
        }
      } catch (error: any) {
        console.error("Failed to load partner:", error);
        setSubmitError("Failed to load partner details");
      } finally {
        setPageLoading(false);
      }
    };

    loadPartner();
  }, [partnerId, fetchPartnerById]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSocialLinkChange = (index: number, value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index] = value;
    setSocialLinks(newLinks);
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, ""]);
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setSubmitError("Image size should be less than 5MB");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(partner?.partnerImage?.imageUrl || partner?.partnerImage?.url || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerId) return;

    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const formDataToSend = new FormData();

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString());
      });

      // Add social links
      const validSocialLinks = socialLinks.filter((link) => link.trim() !== "");
      validSocialLinks.forEach((link) => {
        formDataToSend.append("socialLinks[]", link);
      });

      // Add image if new one selected
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      const result = await updatePartner(partnerId, formDataToSend);

      if (result) {
        setSubmitSuccess(true);
        setPartner(result);
        setTimeout(() => setSubmitSuccess(false), 3000);
      } else {
        setSubmitError("Failed to update partner. Please try again.");
      }
    } catch (error: any) {
      console.error("Update partner error:", error);
      setSubmitError(
        error.response?.data?.message || 
        error.message || 
        "An error occurred while updating the partner"
      );
    }
  };

  const handleToggleStatus = async () => {
    if (!partnerId) return;

    try {
      const result = await togglePartnerStatus(partnerId);
      if (result) {
        setPartner(result);
        setFormData((prev) => ({ ...prev, isActive: result.isActive }));
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 2000);
      }
    } catch (error: any) {
      console.error("Toggle status error:", error);
      setSubmitError("Failed to toggle partner status");
    }
  };

  const handleDelete = async () => {
    if (!partnerId) return;

    try {
      const success = await deletePartner(partnerId);
      if (success) {
        router.push("/dashboard/partners");
      } else {
        setSubmitError("Failed to delete partner");
      }
    } catch (error: any) {
      console.error("Delete partner error:", error);
      setSubmitError("Failed to delete partner");
    }
  };

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Partner not found
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-pink-600 mb-4"
        >
          <ArrowLeft size={20} />
          Back to Partners
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Edit Partner</h1>
            <p className="text-gray-600 text-sm mt-1">
              Update partner information
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                formData.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {formData.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {submitSuccess && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          ✓ Partner updated successfully!
        </div>
      )}

      {/* Error Message */}
      {submitError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {submitError}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        {/* Partner Type Display */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Partner Type
          </label>
          <div className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
            {formData.partnerType === "business" ? (
              <>
                <Building2 size={24} className="text-gray-600" />
                <div>
                  <div className="font-medium text-gray-800">Business</div>
                  <div className="text-xs text-gray-500">Company or Organization</div>
                </div>
              </>
            ) : (
              <>
                <User size={24} className="text-gray-600" />
                <div>
                  <div className="font-medium text-gray-800">Individual</div>
                  <div className="text-xs text-gray-500">Person or Professional</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Partner Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Partner Image
          </label>
          {imagePreview ? (
            <div className="relative w-40 h-40 border-2 border-gray-200 rounded-lg overflow-hidden">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-pink-600 transition">
              <Upload size={32} className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Upload Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
          <p className="text-xs text-gray-500 mt-2">Max size: 5MB. Leave unchanged to keep current image.</p>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              maxLength={100}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-transparent"
              placeholder="Enter partner name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profession *
            </label>
            <input
              type="text"
              name="profession"
              value={formData.profession}
              onChange={handleInputChange}
              required
              maxLength={100}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-transparent"
              placeholder="e.g., Healthcare Provider"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-transparent"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-transparent"
              placeholder="+2348012345678"
            />
            <p className="text-xs text-gray-500 mt-1">Format: +2348012345678 or 08012345678</p>
          </div>
        </div>

        {/* Business Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Address *
          </label>
          <input
            type="text"
            name="businessAddress"
            value={formData.businessAddress}
            onChange={handleInputChange}
            required
            maxLength={300}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-transparent"
            placeholder="Enter full business address"
          />
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-transparent"
            placeholder="https://www.example.com"
          />
        </div>

        {/* Social Links */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Social Links
          </label>
          <div className="space-y-2">
            {socialLinks.map((link, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="url"
                  value={link}
                  onChange={(e) => handleSocialLinkChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-transparent"
                  placeholder="https://facebook.com/yourpage"
                />
                {socialLinks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSocialLink(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addSocialLink}
            className="mt-2 text-sm text-pink-600 hover:text-pink-700 font-medium"
          >
            + Add Another Social Link
          </button>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            maxLength={1000}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-transparent"
            placeholder="Brief description about the partner..."
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.description.length}/1000 characters
          </p>
        </div>

        {/* Active Status */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleInputChange}
            className="w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-600"
          />
          <label className="text-sm font-medium text-gray-700">
            Set as Active Partner
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            {loading ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={handleToggleStatus}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formData.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
            {formData.isActive ? "Deactivate" : "Activate"}
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
          >
            <Trash2 size={18} />
            Delete Partner
          </button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Delete Partner</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{partner.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  handleDelete();
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
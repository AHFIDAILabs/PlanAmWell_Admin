"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePartner } from "../../../hooks/usePartner";
import { ArrowLeft, Upload, X, Building2, User } from "lucide-react";

export default function CreatePartnerPage() {
  const router = useRouter();
  const { createPartner, loading } = usePartner();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profession: "",
    businessAddress: "",
    description: "",
    website: "",
    partnerType: "business" as "individual" | "business",
    isActive: true,
  });

  const [socialLinks, setSocialLinks] = useState<string[]>([""]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const formDataToSend = new FormData();

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString());
      });

      // Add social links (filter out empty ones)
      const validSocialLinks = socialLinks.filter((link) => link.trim() !== "");
      formDataToSend.append("socialLinks", JSON.stringify(validSocialLinks));

      // Add image if selected
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      const result = await createPartner(formDataToSend);

      if (result) {
        setSubmitSuccess(true);
        setTimeout(() => {
          router.push("/dashboard/partners");
        }, 1500);
      } else {
        setSubmitError("Failed to create partner. Please try again.");
      }
    } catch (error: any) {
      console.error("Create partner error:", error);
      setSubmitError(error.message || "An error occurred while creating the partner");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-pink-600 mb-4"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Create New Partner</h1>
        <p className="text-gray-600 text-sm mt-1">
          Add a new partner to your network
        </p>
      </div>

      {/* Success Message */}
      {submitSuccess && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          ✓ Partner created successfully! Redirecting...
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
        {/* Partner Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Partner Type *
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, partnerType: "business" })}
              className={`p-4 border-2 rounded-lg flex items-center gap-3 transition ${
                formData.partnerType === "business"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Building2 size={24} className={formData.partnerType === "business" ? "text-pink-600" : "text-gray-400"} />
              <div className="text-left">
                <div className="font-medium text-gray-800">Business</div>
                <div className="text-xs text-gray-500">Company or Organization</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, partnerType: "individual" })}
              className={`p-4 border-2 rounded-lg flex items-center gap-3 transition ${
                formData.partnerType === "individual"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <User size={24} className={formData.partnerType === "individual" ? "text-pink-600" : "text-gray-400"} />
              <div className="text-left">
                <div className="font-medium text-gray-800">Individual</div>
                <div className="text-xs text-gray-500">Person or Professional</div>
              </div>
            </button>
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
          <p className="text-xs text-gray-500 mt-2">Max size: 5MB</p>
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

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Partner"}
          </button>
        </div>
      </form>
    </div>
  );
}
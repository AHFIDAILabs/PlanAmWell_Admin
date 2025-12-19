"use client";

import { useEffect } from "react";
import { usePartnerContext } from "../../context/PartnerContext";
import { useRouter } from "next/navigation";
import { Building2, Globe, Mail, Phone, MapPin, Plus } from "lucide-react";

export default function PartnersPage() {
  const router = useRouter();
  const { partners, loading, error, fetchAllPartners } = usePartnerContext();

  useEffect(() => {
    fetchAllPartners();
  }, [fetchAllPartners]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Partners</h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage all your partners and collaborations
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/partners/create")}
          className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
        >
          <Plus size={18} />
          Add New Partner
        </button>
      </div>

      {/* Partners Grid */}
      {partners.length === 0 ? (
        <div className="text-center py-12">
          <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No Partners Found
          </h3>
          <p className="text-gray-500 mb-4">
            Get started by adding your first partner
          </p>
          <button
            onClick={() => router.push("/dashboard/partners/create")}
            className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition"
          >
            Add Partner
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner) => (
            <div
              key={partner._id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
              onClick={() => router.push(`/dashboard/partners/${partner._id}`)}
            >
              {/* Partner Image */}
              <div className="h-40 bg-linear-to-br from-pink-100 to-purple-100 rounded-t-lg flex items-center justify-center">
                {partner.logo || partner.partnerImage?.url ? (
                  <img
                    src={partner.partnerImage?.url || partner.logo}
                    alt={partner.name}
                    className="h-full w-full object-cover rounded-t-lg"
                  />
                ) : (
                  <Building2 size={48} className="text-pink-400" />
                )}
              </div>

              {/* Partner Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {partner.name}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      partner.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {partner.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Profession */}
                {partner.profession && (
                  <p className="text-sm text-gray-600 mb-3">
                    {partner.profession}
                  </p>
                )}

                {/* Description */}
                {partner.description && (
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {partner.description}
                  </p>
                )}

                {/* Contact Info */}
                <div className="space-y-2 text-sm text-gray-600">
                  {partner.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-gray-400" />
                      <span className="truncate">{partner.email}</span>
                    </div>
                  )}

                  {partner.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-gray-400" />
                      <span>{partner.phone}</span>
                    </div>
                  )}

                  {partner.website && (
                    <div className="flex items-center gap-2">
                      <Globe size={14} className="text-gray-400" />
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:underline truncate"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Visit Website
                      </a>
                    </div>
                  )}

                  {partner.businessAddress && (
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="truncate">{partner.businessAddress}</span>
                    </div>
                  )}
                </div>

                {/* Partner Type Badge */}
                {partner.partnerType && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium capitalize">
                      {partner.partnerType}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePartnerContext } from "../../context/PartnerContext";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

export default function PartnersListPage() {
  const router = useRouter();
  const { partners, loading, fetchAllPartners } = usePartnerContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    if (partners.length === 0) {
      fetchAllPartners();
    }
  }, []);

  // Filter partners based on search and type
  const filteredPartners = partners.filter((partner) => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.profession?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || partner.partnerType === filterType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Partners</h1>
            <p className="text-gray-600 mt-1">Manage your partner network</p>
          </div>
          <button
            onClick={() => router.push("/dashboard/partners/new")}
            className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
          >
            <Plus size={18} />
            Add Partner
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search partners by name or profession..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="individual">Individual</option>
            <option value="business">Business</option>
            <option value="corporate">Corporate</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Total Partners</p>
          <p className="text-2xl font-bold text-gray-800">{partners.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Active Partners</p>
          <p className="text-2xl font-bold text-green-600">
            {partners.filter(p => p.isActive).length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Business Partners</p>
          <p className="text-2xl font-bold text-blue-600">
            {partners.filter(p => p.partnerType === "business").length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Individual Partners</p>
          <p className="text-2xl font-bold text-purple-600">
            {partners.filter(p => p.partnerType === "individual").length}
          </p>
        </div>
      </div>

      {/* Partners Grid */}
      {filteredPartners.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Partners Found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterType !== "all" 
              ? "Try adjusting your search or filters" 
              : "Get started by adding your first partner"}
          </p>
          {!searchTerm && filterType === "all" && (
            <button
              onClick={() => router.push("/dashboard/partners/new")}
              className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition"
            >
              Add Partner
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPartners.map((partner) => (
            <div
              key={partner._id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              {/* Partner Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center overflow-hidden">
                  {partner.logo || partner.partnerImage?.url ? (
                    <img
                      src={partner.partnerImage?.url || partner.logo}
                      alt={partner.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 size={28} className="text-pink-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-800 truncate mb-1">
                    {partner.name}
                  </h3>
                  <p className="text-sm text-gray-600 truncate mb-2">
                    {partner.profession || "No profession"}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        partner.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {partner.isActive ? "Active" : "Inactive"}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium capitalize">
                      {partner.partnerType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4 text-sm">
                {partner.email && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={14} className="text-gray-400" />
                    <span className="truncate">{partner.email}</span>
                  </div>
                )}
                {partner.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={14} className="text-gray-400" />
                    <span>{partner.phone}</span>
                  </div>
                )}
                {partner.website && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Globe size={14} className="text-gray-400" />
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:underline truncate"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Website
                    </a>
                  </div>
                )}
                {partner.businessAddress && (
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin size={14} className="text-gray-400 mt-0.5" />
                    <span className="text-xs line-clamp-2">{partner.businessAddress}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => router.push(`/dashboard/partners/${partner._id}`)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                >
                  <Eye size={16} />
                  View
                </button>
                <button
                  onClick={() => router.push(`/dashboard/partners/${partner._id}/edit`)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition text-sm"
                >
                  <Edit size={16} />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results count */}
      {filteredPartners.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-600">
          Showing {filteredPartners.length} of {partners.length} partners
        </div>
      )}
    </div>
  );
}
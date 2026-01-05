"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePartnerContext } from "../../../context/PartnerContext";
import { getPartnerByIdService, getPartnerOrdersService } from "../../../services/AdminService";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Edit,
  ArrowLeft,
  Package,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  AlertCircle,
  Download,
} from "lucide-react";

import { Partner } from "@/app/types/partner";

interface Order {
  id: string;
  orderId: string;
  totalPrice: number;
  status: string;
  platform: string;
  user: {
    name: string;
    origin: string;
  };
  frontImage?: string;
  itemCount: number;
  createdAt?: string;
}

export default function PartnerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  
  // 1. Get global state from Context
  const { partners, loading: contextLoading, fetchAllPartners } = usePartnerContext();
  
  // 2. Local states - ALL HOOKS MUST BE AT THE TOP
  const [partner, setPartner] = useState<Partner | null>(null);
  const [localLoading, setLocalLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<"overview" | "orders" | "commission">("overview");

  const partnerId = typeof params.id === "string" ? params.id : params.id?.[0];

  // ✅ ALL useCallback and useEffect hooks BEFORE any conditional returns
  
  // Fetch orders logic
  const fetchPartnerOrders = useCallback(async () => {
    if (!partnerId) return;
    
    setLoadingOrders(true);
    setOrdersError(null);
    try {
      const data = await getPartnerOrdersService(partnerId);
      setOrders(data || []);
    } catch (error: any) {
      console.error("Failed to fetch partner orders:", error);
      setOrdersError(error.message || "Failed to load orders");
    } finally {
      setLoadingOrders(false);
    }
  }, [partnerId]);

  // Helper functions for UI
  const getStatusColor = useCallback((status: string) => {
    const s = status.toLowerCase();
    if (s.includes("delivered")) return "text-green-600 bg-green-50";
    if (s.includes("shipped") || s.includes("transit")) return "text-blue-600 bg-blue-50";
    if (s.includes("pending") || s.includes("processing")) return "text-yellow-600 bg-yellow-50";
    if (s.includes("cancelled") || s.includes("failed")) return "text-red-600 bg-red-50";
    return "text-gray-600 bg-gray-50";
  }, []);

  const getStatusIcon = useCallback((status: string) => {
    const s = status.toLowerCase();
    if (s.includes("delivered")) return <CheckCircle size={16} />;
    if (s.includes("shipped") || s.includes("transit")) return <Truck size={16} />;
    if (s.includes("pending")) return <Clock size={16} />;
    if (s.includes("cancelled")) return <XCircle size={16} />;
    return <Package size={16} />;
  }, []);

  // EFFECT 1: Ensure partners are loaded into context
  useEffect(() => {
    if (partners.length === 0 && !contextLoading) {
      fetchAllPartners();
    }
  }, [partners.length, contextLoading, fetchAllPartners]);

  // EFFECT 2: Sync the specific partner state once data arrives
  useEffect(() => {
    if (!partnerId) return;

    const loadPartner = async () => {
      // 1. Try context first
      const match = partners.find((p) => p._id === partnerId);
      if (match) {
        setPartner(match);
        setLocalLoading(false);
        return;
      }

      // 2. Fetch if not found and context is done
      if (!contextLoading) {
        try {
          const fetchedPartner = await getPartnerByIdService(partnerId);
          
          if (fetchedPartner) {
            setPartner(fetchedPartner);
          } else {
            setPartner(null);
          }
        } catch (error) {
          console.error("Fetch error:", error);
          setPartner(null);
        } finally {
          setLocalLoading(false);
        }
      }
    };

    loadPartner();
  }, [partnerId, partners, contextLoading]);

  // EFFECT 3: Fetch orders when needed
  useEffect(() => {
    if (partner && partner.partnerType === "business" && selectedTab === "orders") {
      fetchPartnerOrders();
    }
  }, [partner, selectedTab, fetchPartnerOrders]);

  // ✅ NOW we can do conditional rendering AFTER all hooks
  const isCurrentlyLoading = (contextLoading && partners.length === 0) || (localLoading && !partner);

  if (isCurrentlyLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-red-600" size={24} />
            <div>
              <h3 className="text-red-700 font-semibold">Partner not found</h3>
              <p className="text-red-600 text-sm">The partner ID "{partnerId}" does not exist.</p>
            </div>
          </div>
          <button
            onClick={() => router.push("/dashboard/partners")}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Back to Partners
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/dashboard/partners")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Partners
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-lg bg-linear-to-br from-pink-100 to-purple-100 flex items-center justify-center overflow-hidden border border-pink-50">
              {partner.partnerImage?.url || partner.logo ? (
                <img
                  src={partner.partnerImage?.url || partner.logo}
                  alt={partner.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 size={32} className="text-pink-400" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-800">{partner.name}</h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    partner.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {partner.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-lg text-gray-600 mb-1">{partner.profession || "No Profession Specified"}</p>
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium capitalize">
                {partner.partnerType}
              </span>
            </div>
          </div>

          <button
            onClick={() => router.push(`/dashboard/partners/${partnerId}/edit`)}
            className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition shadow-sm"
          >
            <Edit size={18} />
            Edit Partner
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-6">
          <button
            onClick={() => setSelectedTab("overview")}
            className={`pb-3 px-1 border-b-2 transition ${
              selectedTab === "overview"
                ? "border-pink-600 text-pink-600 font-medium"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            Overview
          </button>
          {partner.partnerType === "business" && (
            <>
              <button
                onClick={() => setSelectedTab("orders")}
                className={`pb-3 px-1 border-b-2 transition ${
                  selectedTab === "orders"
                    ? "border-pink-600 text-pink-600 font-medium"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => setSelectedTab("commission")}
                className={`pb-3 px-1 border-b-2 transition ${
                  selectedTab === "commission"
                    ? "border-pink-600 text-pink-600 font-medium"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                Commission Report
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content Area */}
      {selectedTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail size={20} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-800">{partner.email || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={20} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-800">{partner.phone || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe size={20} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Website</p>
                  {partner.website ? (
                    <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">
                      {partner.website}
                    </a>
                  ) : "N/A"}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Business Address</p>
                  <p className="text-gray-800">{partner.businessAddress || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">About</h3>
              <p className="text-gray-600 leading-relaxed">
                {partner.description || "No description provided for this partner."}
              </p>
            </div>
          </div>

          {partner.partnerType === "business" && (
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <Package size={20} className="text-pink-600" />
                  <h3 className="text-sm font-medium text-gray-600">Total Orders</h3>
                </div>
                <p className="text-3xl font-bold text-gray-800">{orders.length}</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign size={20} className="text-green-600" />
                  <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
                </div>
                <p className="text-3xl font-bold text-gray-800">
                  ₦{orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {selectedTab === "orders" && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Partner Orders</h2>
              <p className="text-sm text-gray-600 mt-1">Orders fulfilled by {partner.name}</p>
            </div>
            <button className="flex items-center gap-2 text-sm text-pink-600 font-medium hover:text-pink-700">
              <Download size={16} /> Export
            </button>
          </div>

          {loadingOrders ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
            </div>
          ) : ordersError ? (
            <div className="p-6 text-center text-red-600 bg-red-50">{ordersError}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.orderId}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{order.user.name}</div>
                        <div className="text-xs text-gray-500">{order.user.origin}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{order.itemCount} items</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">₦{order.totalPrice.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)} {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && <div className="p-12 text-center text-gray-400">No orders found.</div>}
            </div>
          )}
        </div>
      )}

      {selectedTab === "commission" && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Commission Report</h2>
          <div className="p-8 border-2 border-dashed border-gray-100 rounded-xl text-center">
            <TrendingUp size={40} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500">Reconciliation data for delivered orders will appear here shortly.</p>
          </div>
        </div>
      )}
    </div>
  );
}
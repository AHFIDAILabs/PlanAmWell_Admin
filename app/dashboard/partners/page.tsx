"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePartnerContext } from "../../context/PartnerContext";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Edit,
  ArrowLeft,
  Calendar,
  Package,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
} from "lucide-react";

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
  orderDate?: string;
}

export default function PartnerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { partners, loading, fetchAllPartners } = usePartnerContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"overview" | "orders" | "commission">("overview");

  const partner = partners.find((p) => p._id === params.id);

  useEffect(() => {
    if (partners.length === 0) {
      fetchAllPartners();
    }
  }, [partners, fetchAllPartners]);

  useEffect(() => {
    // Fetch orders for this partner if they're a corporate/pharmacy partner
    if (partner && partner.partnerType === "business") {
      fetchPartnerOrders();
    }
  }, [partner]);

  const fetchPartnerOrders = async () => {
    setLoadingOrders(true);
    try {
      // Replace with your actual API call to partner's endpoint
      const response = await fetch(`/api/partners/${params.id}/orders`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Failed to fetch partner orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("delivered")) return "text-green-600 bg-green-50";
    if (statusLower.includes("shipped") || statusLower.includes("transit"))
      return "text-blue-600 bg-blue-50";
    if (statusLower.includes("pending") || statusLower.includes("processing"))
      return "text-yellow-600 bg-yellow-50";
    if (statusLower.includes("cancelled") || statusLower.includes("failed"))
      return "text-red-600 bg-red-50";
    return "text-gray-600 bg-gray-50";
  };

  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("delivered")) return <CheckCircle size={16} />;
    if (statusLower.includes("shipped") || statusLower.includes("transit"))
      return <Truck size={16} />;
    if (statusLower.includes("pending")) return <Clock size={16} />;
    if (statusLower.includes("cancelled")) return <XCircle size={16} />;
    return <Package size={16} />;
  };

  if (loading) {
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
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/dashboard/partners")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft size={20} />
          Back to Partners
        </button>

        <div className="flex justify-between items-start">
          <div className="flex items-start gap-4">
            {/* Partner Logo/Image */}
            <div className="w-20 h-20 rounded-lg bg-linear-to-br from-pink-100 to-purple-100 flex items-center justify-center">
              {partner.logo || partner.partnerImage?.url ? (
                <img
                  src={partner.partnerImage?.url || partner.logo}
                  alt={partner.name}
                  className="w-full h-full object-cover rounded-lg"
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
                    partner.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {partner.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              {partner.profession && (
                <p className="text-lg text-gray-600 mb-1">{partner.profession}</p>
              )}
              {partner.partnerType && (
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium capitalize">
                  {partner.partnerType}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => router.push(`/dashboard/partners/${params.id}/edit`)}
            className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
          >
            <Edit size={18} />
            Edit Partner
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-6">
          <button
            onClick={() => setSelectedTab("overview")}
            className={`pb-3 px-1 border-b-2 transition ${
              selectedTab === "overview"
                ? "border-pink-600 text-pink-600 font-medium"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            Overview
          </button>
          {partner.partnerType === "corporate" && (
            <>
              <button
                onClick={() => setSelectedTab("orders")}
                className={`pb-3 px-1 border-b-2 transition ${
                  selectedTab === "orders"
                    ? "border-pink-600 text-pink-600 font-medium"
                    : "border-transparent text-gray-600 hover:text-gray-800"
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => setSelectedTab("commission")}
                className={`pb-3 px-1 border-b-2 transition ${
                  selectedTab === "commission"
                    ? "border-pink-600 text-pink-600 font-medium"
                    : "border-transparent text-gray-600 hover:text-gray-800"
                }`}
              >
                Commission Report
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tab Content */}
      {selectedTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Information */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Contact Information
            </h2>
            <div className="space-y-4">
              {partner.email && (
                <div className="flex items-start gap-3">
                  <Mail size={20} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-800">{partner.email}</p>
                  </div>
                </div>
              )}

              {partner.phone && (
                <div className="flex items-start gap-3">
                  <Phone size={20} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-800">{partner.phone}</p>
                  </div>
                </div>
              )}

              {partner.website && (
                <div className="flex items-start gap-3">
                  <Globe size={20} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:underline"
                    >
                      {partner.website}
                    </a>
                  </div>
                </div>
              )}

              {partner.businessAddress && (
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Business Address</p>
                    <p className="text-gray-800">{partner.businessAddress}</p>
                  </div>
                </div>
              )}
            </div>

            {partner.description && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  About
                </h3>
                <p className="text-gray-600 leading-relaxed">{partner.description}</p>
              </div>
            )}
          </div>

          {/* Quick Stats (for corporate partners) */}
          {partner.partnerType === "corporate" && (
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Package size={20} className="text-pink-600" />
                  <h3 className="text-sm font-medium text-gray-600">Total Orders</h3>
                </div>
                <p className="text-3xl font-bold text-gray-800">{orders.length}</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign size={20} className="text-green-600" />
                  <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
                </div>
                <p className="text-3xl font-bold text-gray-800">
                  ₦{orders.reduce((sum, order) => sum + order.totalPrice, 0).toLocaleString()}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp size={20} className="text-blue-600" />
                  <h3 className="text-sm font-medium text-gray-600">Active Orders</h3>
                </div>
                <p className="text-3xl font-bold text-gray-800">
                  {orders.filter((o) => o.status.toLowerCase().includes("pending") || 
                    o.status.toLowerCase().includes("processing")).length}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {selectedTab === "orders" && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Partner Orders</h2>
            <p className="text-sm text-gray-600 mt-1">
              All orders from {partner.name}
            </p>
          </div>

          {loadingOrders ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No Orders Yet
              </h3>
              <p className="text-gray-500">
                Orders from this partner will appear here
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {order.orderId}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {order.user.name}
                          </p>
                          <p className="text-xs text-gray-500">{order.user.origin}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {order.itemCount} item{order.itemCount !== 1 ? "s" : ""}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          ₦{order.totalPrice.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.orderDate
                          ? new Date(order.orderDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {selectedTab === "commission" && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Commission Report
          </h2>
          <p className="text-gray-600">
            Commission report feature coming soon. This will display monthly
            reconciliation data for delivered orders.
          </p>
        </div>
      )}
    </div>
  );
}
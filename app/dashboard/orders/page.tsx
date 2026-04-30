"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, RefreshCw, BarChart2 } from "lucide-react";
import { getAllOrdersService } from "../../services/AdminService";

const STATUS_COLORS: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  delivered: "bg-green-100 text-green-700",
  shipped: "bg-blue-100 text-blue-700",
  pending: "bg-orange-100 text-orange-700",
  failed: "bg-red-100 text-red-700",
  cancelled: "bg-red-100 text-red-700",
  processing: "bg-purple-100 text-purple-700",
};

function Badge({ label }: { label: string }) {
  const cls = STATUS_COLORS[label?.toLowerCase()] ?? "bg-gray-100 text-gray-600";
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${cls}`}>
      {label}
    </span>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [deliveryFilter, setDeliveryFilter] = useState("all");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrdersService();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const q = search.toLowerCase();
      const matchSearch =
        o.orderNumber?.toLowerCase().includes(q) ||
        o.shippingAddress?.name?.toLowerCase().includes(q) ||
        o.shippingAddress?.phone?.toLowerCase().includes(q);
      const matchPayment = paymentFilter === "all" || o.paymentStatus === paymentFilter;
      const matchDelivery = deliveryFilter === "all" || o.deliveryStatus === deliveryFilter;
      return matchSearch && matchPayment && matchDelivery;
    });
  }, [orders, search, paymentFilter, deliveryFilter]);

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + Number(o.total ?? 0), 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
          <p className="text-gray-500 mt-1">Manage and track all customer orders</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/dashboard/orders/commission")}
            className="flex items-center gap-2 px-4 py-2 border border-pink-600 text-pink-600 rounded-lg hover:bg-pink-50 transition text-sm font-medium"
          >
            <BarChart2 size={16} /> Commission Report
          </button>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition text-sm font-medium"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-1">Paid</p>
          <p className="text-2xl font-bold text-green-600">
            {orders.filter((o) => o.paymentStatus === "paid").length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-1">Pending Payment</p>
          <p className="text-2xl font-bold text-orange-500">
            {orders.filter((o) => o.paymentStatus === "pending").length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-pink-600">
            ₦{totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by order #, name, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
          />
        </div>
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-sm"
        >
          <option value="all">All Payments</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
        </select>
        <select
          value={deliveryFilter}
          onChange={(e) => setDeliveryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-sm"
        >
          <option value="all">All Deliveries</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-500">No orders match your filters.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Order #</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Customer</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Total</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Payment</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Delivery</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-mono font-semibold text-gray-700">
                    #{order.orderNumber?.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{order.shippingAddress?.name ?? "—"}</p>
                    <p className="text-xs text-gray-500">{order.shippingAddress?.phone ?? ""}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-800">
                    ₦{Number(order.total ?? 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge label={order.paymentStatus ?? "pending"} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge label={order.deliveryStatus ?? "pending"} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => router.push(`/dashboard/orders/${order._id}`)}
                      className="px-3 py-1 text-xs bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 border-t border-gray-100 text-sm text-gray-500">
            Showing {filtered.length} of {orders.length} orders
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, RefreshCw, Package, MapPin, CreditCard, Truck } from "lucide-react";
import { getAllOrdersService, refreshOrderDeliveryService } from "../../../services/AdminService";

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

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-800">{value ?? "—"}</span>
    </div>
  );
}

function OrderDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id") ?? "";

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshMsg, setRefreshMsg] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const all = await getAllOrdersService();
        const found = all.find((o: any) => o._id === orderId);
        setOrder(found ?? null);
      } catch (err) {
        console.error("Failed to load order", err);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) load();
  }, [orderId]);

  const handleRefreshDelivery = async () => {
    setRefreshing(true);
    setRefreshMsg(null);
    try {
      const result = await refreshOrderDeliveryService(orderId);
      if (result?.data?.deliveryStatus) {
        setOrder((prev: any) => ({ ...prev, deliveryStatus: result.data.deliveryStatus }));
        setRefreshMsg(`Delivery status updated to: ${result.data.deliveryStatus}`);
      } else {
        setRefreshMsg("Delivery status refreshed (no change).");
      }
    } catch (err: any) {
      setRefreshMsg("Failed to refresh delivery status from partner.");
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm">
          <ArrowLeft size={16} /> Back to Orders
        </button>
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-500">Order not found.</p>
        </div>
      </div>
    );
  }

  const subtotal = Number(order.subtotal ?? 0);
  const shippingFee = Number(order.shippingFee ?? 0);
  const total = Number(order.total ?? subtotal + shippingFee);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm">
            <ArrowLeft size={16} /> Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Order #{order.orderNumber?.slice(0, 8).toUpperCase() ?? orderId.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {order.createdAt ? new Date(order.createdAt).toLocaleString() : "—"}
            </p>
          </div>
        </div>
        <button
          onClick={handleRefreshDelivery}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition text-sm font-medium disabled:opacity-60"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh Delivery"}
        </button>
      </div>

      {refreshMsg && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm">
          {refreshMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard size={18} className="text-pink-600" />
            <h2 className="font-semibold text-gray-700">Order Status</h2>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">Payment Status</span>
            <Badge label={order.paymentStatus ?? "pending"} />
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">Delivery Status</span>
            <Badge label={order.deliveryStatus ?? "pending"} />
          </div>
          {order.partnerOrderCode && (
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-500">Partner Order Code</span>
              <span className="text-sm font-mono font-medium text-gray-800">{order.partnerOrderCode}</span>
            </div>
          )}
        </div>

        {/* Shipping Address */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={18} className="text-pink-600" />
            <h2 className="font-semibold text-gray-700">Shipping Address</h2>
          </div>
          <InfoRow label="Name" value={order.shippingAddress?.name} />
          <InfoRow label="Phone" value={order.shippingAddress?.phone} />
          <InfoRow label="Address" value={order.shippingAddress?.addressLine ?? order.shippingAddress?.address} />
          <InfoRow label="City" value={order.shippingAddress?.city} />
          <InfoRow label="LGA" value={order.shippingAddress?.lga} />
          <InfoRow label="State" value={order.shippingAddress?.state} />
        </div>

        {/* Order Items */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Package size={18} className="text-pink-600" />
            <h2 className="font-semibold text-gray-700">Items</h2>
          </div>
          {order.items?.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-3 py-2 font-semibold text-gray-600">Product</th>
                  <th className="text-center px-3 py-2 font-semibold text-gray-600">Qty</th>
                  <th className="text-right px-3 py-2 font-semibold text-gray-600">Unit Price</th>
                  <th className="text-right px-3 py-2 font-semibold text-gray-600">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-3 py-3">
                      <p className="font-medium text-gray-800">{item.name ?? item.productId ?? "—"}</p>
                      {item.sku && <p className="text-xs text-gray-500">SKU: {item.sku}</p>}
                    </td>
                    <td className="px-3 py-3 text-center text-gray-700">{item.quantity ?? 1}</td>
                    <td className="px-3 py-3 text-right text-gray-700">
                      ₦{Number(item.price ?? 0).toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-right font-semibold text-gray-800">
                      ₦{(Number(item.price ?? 0) * Number(item.quantity ?? 1)).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-sm">No item details available.</p>
          )}

          {/* Financials */}
          <div className="mt-4 border-t border-gray-200 pt-4 space-y-2 max-w-xs ml-auto">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium text-gray-800">₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Delivery Fee</span>
              <span className="font-medium text-gray-800">₦{shippingFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm font-bold border-t border-gray-200 pt-2">
              <span className="text-gray-700">Total</span>
              <span className="text-pink-600 text-base">₦{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        {(order.deliveryInfo || order.trackingNumber) && (
          <div className="bg-white border border-gray-200 rounded-lg p-5 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Truck size={18} className="text-pink-600" />
              <h2 className="font-semibold text-gray-700">Delivery Info</h2>
            </div>
            {order.trackingNumber && <InfoRow label="Tracking Number" value={order.trackingNumber} />}
            {order.deliveryInfo?.carrier && <InfoRow label="Carrier" value={order.deliveryInfo.carrier} />}
            {order.deliveryInfo?.estimatedDate && (
              <InfoRow
                label="Estimated Delivery"
                value={new Date(order.deliveryInfo.estimatedDate).toLocaleDateString()}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600" />
        </div>
      }
    >
      <OrderDetail />
    </Suspense>
  );
}

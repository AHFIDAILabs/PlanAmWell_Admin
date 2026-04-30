"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, BarChart2, TrendingUp } from "lucide-react";
import { getCommissionReportService } from "../../../services/AdminService";

interface CommissionRecord {
  orderDate?: string;
  orderStatus?: string;
  orderCode?: string;
  itemsPurchased?: number;
  totalTransactionValue?: number;
  commissionAmountDue?: number;
  [key: string]: any;
}

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

export default function CommissionReportPage() {
  const router = useRouter();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [records, setRecords] = useState<CommissionRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCommissionReportService(year, month);
      setRecords(Array.isArray(data) ? data : data?.orders ?? data?.records ?? []);
      setFetched(true);
    } catch (err: any) {
      setError("Failed to fetch commission report. Please try again.");
      console.error("Commission report error:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalOrders = records.length;
  const totalTransactionValue = records.reduce(
    (sum, r) => sum + Number(r.totalTransactionValue ?? 0),
    0
  );
  const totalCommission = records.reduce(
    (sum, r) => sum + Number(r.commissionAmountDue ?? 0),
    0
  );

  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BarChart2 size={22} className="text-pink-600" /> Commission Report
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Monthly commission breakdown from partner orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              min={2020}
              max={now.getFullYear() + 1}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-sm w-32"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-sm"
            >
              {MONTHS.map((m, i) => (
                <option key={i + 1} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
          <button
            onClick={fetchReport}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition text-sm font-medium disabled:opacity-60"
          >
            <Search size={16} />
            {loading ? "Loading..." : "Generate Report"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {fetched && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
              <p className="text-xs text-gray-400 mt-1">{MONTHS[month - 1]} {year}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Total Transaction Value</p>
              <p className="text-2xl font-bold text-gray-800">₦{totalTransactionValue.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">Sum of all order values</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp size={14} className="text-pink-600" />
                <p className="text-sm text-gray-500">Total Commission Due</p>
              </div>
              <p className="text-2xl font-bold text-pink-600">₦{totalCommission.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">
                {totalTransactionValue > 0
                  ? `${((totalCommission / totalTransactionValue) * 100).toFixed(1)}% of total value`
                  : "—"}
              </p>
            </div>
          </div>

          {/* Records Table */}
          {records.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <p className="text-gray-500">No commission records found for {MONTHS[month - 1]} {year}.</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Order Code</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-600">Items</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Transaction Value</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Commission Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {records.map((r, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-mono text-gray-700 text-xs">
                        {r.orderCode ?? r.orderId ?? `—`}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {r.orderDate ? new Date(r.orderDate).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {r.orderStatus ? <Badge label={r.orderStatus} /> : "—"}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700">
                        {r.itemsPurchased ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-800">
                        ₦{Number(r.totalTransactionValue ?? 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-pink-600">
                        ₦{Number(r.commissionAmountDue ?? 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t border-gray-200">
                  <tr>
                    <td colSpan={4} className="px-4 py-3 font-semibold text-gray-600 text-sm">
                      Totals ({totalOrders} orders)
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-800">
                      ₦{totalTransactionValue.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-pink-600">
                      ₦{totalCommission.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </>
      )}

      {!fetched && !loading && (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <BarChart2 size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Select a year and month, then click <strong>Generate Report</strong>.</p>
        </div>
      )}
    </div>
  );
}

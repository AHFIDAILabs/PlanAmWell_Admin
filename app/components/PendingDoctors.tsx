"use client";

import { useState } from "react";
import { useAllDoctors } from "../hooks/useAllDoctors";
import { useRouter } from "next/navigation";

export default function PendingDoctors() {
  const { doctors, loading, updatingId, error, fetchDoctors, updateDoctorStatus } = useAllDoctors();
  const [tab, setTab] = useState<"pending" | "approved">("pending");
  const router = useRouter();

  const pendingDoctors = doctors.filter((d) => d.status === "submitted" || d.status === "reviewing");
  const approvedDoctors = doctors.filter((d) => d.status === "approved");

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-pink-600 font-bold text-lg animate-pulse">
        Loading doctors...
      </div>
    );

  return (
    <div className="bg-linear-to-r from-pink-50 to-purple-50 p-6 rounded-2xl shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-extrabold text-2xl text-pink-600">🩺 Doctor Management</h3>

        <button
          onClick={fetchDoctors}
          className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-500 transition-all shadow-md"
        >
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 text-red-600 font-semibold animate-shake">
          ⚠️ {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex mb-4 space-x-4">
        <button
          onClick={() => setTab("pending")}
          className={`px-4 py-2 rounded-full font-semibold ${
            tab === "pending" ? "bg-pink-600 text-white" : "bg-pink-100 text-pink-700"
          } transition-all`}
        >
          Pending ({pendingDoctors.length})
        </button>
        <button
          onClick={() => setTab("approved")}
          className={`px-4 py-2 rounded-full font-semibold ${
            tab === "approved" ? "bg-green-600 text-white" : "bg-green-100 text-green-700"
          } transition-all`}
        >
          Approved ({approvedDoctors.length})
        </button>
      </div>

      {/* Table */}
      <table className="w-full table-auto rounded-lg overflow-hidden shadow-lg">
        <thead className="bg-pink-600 text-white">
          <tr>
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">Specialization</th>
            <th className="py-3 px-4 text-left">Submitted</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>

       <tbody>
  {(tab === "pending" ? pendingDoctors : approvedDoctors).map((doc: any) => (
    <tr
      key={doc._id}
      className="odd:bg-pink-50 even:bg-purple-50 hover:bg-purple-100 transition-colors"
    >
      {/* Name */}
      <td className="py-3 px-4 font-semibold text-gray-700">
        {doc.name || `${doc.firstName || ""} ${doc.lastName || ""}`.trim() || "No Name"}
      </td>

      {/* Specialization */}
      <td className="py-3 px-4 text-gray-600">
        {typeof doc.specialization === "string"
          ? doc.specialization
          : doc.specialization
          ? JSON.stringify(doc.specialization)
          : "Unknown"}
      </td>

      {/* Submitted date */}
      <td className="py-3 px-4 text-gray-500">
        {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "N/A"}
      </td>

      {/* Actions */}
      <td className="py-3 px-4 flex space-x-2">
        {/* VIEW */}
        <button
          onClick={() => router.push(`/dashboard/doctors/${doc._id}`)}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-semibold shadow transition"
        >
          👁️ View
        </button>

        {tab === "pending" && (
          <>
            {/* APPROVE */}
            <button
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                updatingId === doc._id
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-500"
              } text-white`}
              onClick={() => updateDoctorStatus(doc._id, "approved")}
              disabled={updatingId === doc._id}
            >
              ✅ Approve
            </button>

            {/* DENY */}
            <button
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                updatingId === doc._id
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-500"
              } text-white`}
              onClick={() => updateDoctorStatus(doc._id, "rejected")}
              disabled={updatingId === doc._id}
            >
              ❌ Deny
            </button>
          </>
        )}
      </td>
    </tr>
  ))}
</tbody>

      </table>

      {(tab === "pending" ? pendingDoctors : approvedDoctors).length === 0 && (
        <div className="mt-6 text-center text-gray-500 font-medium">
          {tab === "pending" ? "No pending doctors 🎉" : "No approved doctors yet"}
        </div>
      )}
    </div>
  );
}

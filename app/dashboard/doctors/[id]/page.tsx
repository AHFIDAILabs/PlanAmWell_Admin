"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAllDoctors, updateDoctorStatusService } from "../../../services/AdminService";

// Helper to safely display nested objects
const formatAvailability = (availability: any) => {
  if (!availability) return "N/A";
  return Object.entries(availability).map(([day, hours]: [string, any]) => {
    const hoursText =
      typeof hours === "string" ? hours :
      hours?.from && hours?.to ? `${hours.from} - ${hours.to}` :
      JSON.stringify(hours);
    return { day, hoursText };
  });
};

export default function DoctorDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchDoctor = async () => {
      try {
        const data = await getAllDoctors();
        const doc = data.find((d: any) => d._id === id);
        if (doc) {
          // Flatten and normalize fields for safe rendering
          setDoctor({
            ...doc,
            fullName: doc.name || `${doc.firstName || ""} ${doc.lastName || ""}`.trim() || "No Name",
            specializationDisplay: Array.isArray(doc.specialization)
              ? doc.specialization.join(", ")
              : doc.specialization || "N/A",
            availabilityDisplay: formatAvailability(doc.availability),
            createdAtDisplay: doc.createdAt ? new Date(doc.createdAt).toLocaleString() : "N/A",
          });
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch doctor");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  if (loading) return <p className="text-center text-pink-600 mt-20 animate-pulse">Loading doctor details...</p>;
  if (error) return <p className="text-center text-red-600 mt-20">{error}</p>;
  if (!doctor) return <p className="text-center mt-20">Doctor not found.</p>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800";
      case "submitted": case "reviewing": return "bg-yellow-100 text-yellow-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusUpdate = async (status: "approved" | "rejected") => {
    if (!doctor) return;
    try {
      setUpdating(true);
      await updateDoctorStatusService(doctor._id, status);
      setDoctor({ ...doctor, status });
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const imageSrc =
    doctor.profileImage ||
    doctor.doctorImage?.url ||
    "/default-avatar.png";

  return (
    <div className="p-6 flex justify-center">
      <div className="max-w-2xl w-full bg-white shadow-2xl rounded-2xl p-8 space-y-6 transform hover:scale-105 transition duration-300">
        <div className="flex items-center space-x-6">
          <img
            src={imageSrc}
            alt={doctor.fullName}
            className="w-24 h-24 rounded-full object-cover border-2 border-pink-600"
          />
          <div>
            <h1 className="text-3xl font-bold text-pink-600">{doctor.fullName}</h1>
            <span className={`inline-block px-4 py-2 rounded-full font-medium ${getStatusColor(doctor.status)}`}>
              {doctor.status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          <p><strong>Email:</strong> {doctor.email || "N/A"}</p>
          <p><strong>License Number:</strong> {doctor.licenseNumber || "N/A"}</p>
          <p><strong>Specialization:</strong> {doctor.specializationDisplay}</p>
          <p><strong>Years of Experience:</strong> {doctor.yearsOfExperience ?? "N/A"}</p>
          <p><strong>Contact Number:</strong> {doctor.contactNumber || "N/A"}</p>
          <p><strong>Joined At:</strong> {doctor.createdAtDisplay}</p>
          <p className="sm:col-span-2"><strong>Bio:</strong> {doctor.bio || "N/A"}</p>

          <div className="sm:col-span-2">
            <strong>Availability:</strong>
            {doctor.availabilityDisplay?.length ? (
              <div className="overflow-x-auto mt-2">
                <table className="min-w-full border border-gray-200 rounded-lg text-gray-700">
                  <thead className="bg-pink-100">
                    <tr>
                      <th className="py-2 px-4 border-b text-left">Day</th>
                      <th className="py-2 px-4 border-b text-left">Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctor.availabilityDisplay.map((a: any) => (
                      <tr key={a.day} className="hover:bg-pink-50 transition-colors">
                        <td className="py-2 px-4 border-b capitalize">{a.day}</td>
                        <td className="py-2 px-4 border-b">{a.hoursText}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>N/A</p>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => handleStatusUpdate("approved")}
            disabled={updating || doctor.status === "approved"}
            className={`flex-1 py-2 px-4 rounded-xl text-white font-semibold transition-colors mr-4 ${
              doctor.status === "approved" ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-500"
            }`}
          >
            ✅ Approve
          </button>

          <button
            onClick={() => handleStatusUpdate("rejected")}
            disabled={updating || doctor.status === "rejected"}
            className={`flex-1 py-2 px-4 rounded-xl text-white font-semibold transition-colors ${
              doctor.status === "rejected" ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-500"
            }`}
          >
            ❌ Reject
          </button>
        </div>
      </div>
    </div>
  );
}

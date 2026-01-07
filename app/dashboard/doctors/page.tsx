"use client";

import { useState, useEffect, useMemo } from "react";
import { getAllDoctors } from "../../services/AdminService";
import { useRouter } from "next/navigation";

type StatusFilter =
  | "all"
  | "approved"
  | "submitted"
  | "reviewing"
  | "rejected";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const router = useRouter();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getAllDoctors();
        setDoctors(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch doctors");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((d) => {
      const matchesSearch =
        d.name?.toLowerCase().includes(search.toLowerCase()) ||
        d.email?.toLowerCase().includes(search.toLowerCase()) ||
        d.specialization?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || d.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [doctors, search, statusFilter]);

  if (loading) return <p>Loading doctors...</p>;
  if (error) return <p>Error loading doctors: {error}</p>;

  const handleCardClick = (id: string) =>
    router.push(`/dashboard/doctors/${id}`);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "submitted":
      case "reviewing":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-pink-600">
        All Doctors
      </h1>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or specialization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-2/3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as StatusFilter)
          }
          className="w-full sm:w-1/3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="approved">Approved</option>
          <option value="reviewing">Reviewing</option>
          <option value="submitted">Submitted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <p className="text-gray-500">No doctors found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((d) => (
            <div
              key={d._id}
              onClick={() => handleCardClick(d._id)}
              className="bg-white shadow-lg rounded-xl p-5 cursor-pointer transform hover:-translate-y-1 hover:shadow-2xl transition duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold">{d.name}</h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    d.status
                  )}`}
                >
                  {d.status.toUpperCase()}
                </span>
              </div>

              <p className="text-gray-600 mb-1">
                <strong>Email:</strong> {d.email}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Specialization:</strong>{" "}
                {d.specialization || "N/A"}
              </p>
              <p className="text-gray-500 text-sm">
                <strong>Joined:</strong>{" "}
                {new Date(d.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

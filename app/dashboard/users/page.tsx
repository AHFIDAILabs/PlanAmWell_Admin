"use client";

import { useState, useEffect, useMemo } from "react";
import { getAllUsers } from "../../services/AdminService";
import { useRouter } from "next/navigation";

type FilterType = "all" | "active" | "no-email";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.phone?.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "active" && u.email) ||
        (filter === "no-email" && !u.email);

      return matchesSearch && matchesFilter;
    });
  }, [users, search, filter]);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error loading users: {error}</p>;

  const handleCardClick = (id: string) =>
    router.push(`/dashboard/users/${id}`);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-pink-600">All Users</h1>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-2/3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterType)}
          className="w-full sm:w-1/3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
        >
          <option value="all">All Users</option>
          <option value="active">Active (Has Email)</option>
          <option value="no-email">No Email</option>
        </select>
      </div>

      {/* Users Grid */}
      {filteredUsers.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((u) => (
            <div
              key={u._id}
              onClick={() => handleCardClick(u._id)}
              className="bg-white shadow-lg rounded-xl p-5 cursor-pointer transform hover:-translate-y-1 hover:shadow-2xl transition duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold">{u.name}</h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    u.email
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {u.email ? "Active" : "No Email"}
                </span>
              </div>
              <p className="text-gray-600 mb-1">
                <strong>Email:</strong> {u.email || "N/A"}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Phone:</strong> {u.phone || "N/A"}
              </p>
              <p className="text-gray-500 text-sm">
                <strong>Joined:</strong>{" "}
                {new Date(u.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

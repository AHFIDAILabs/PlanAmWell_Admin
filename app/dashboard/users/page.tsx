"use client";

import { useState, useEffect } from "react";
import { getAllUsers } from "../../services/AdminService";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error loading users: {error}</p>;

  const handleCardClick = (id: string) => router.push(`/dashboard/users/${id}`);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-pink-600">All Users</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((u) => (
          <div
            key={u._id}
            onClick={() => handleCardClick(u._id)}
            className="bg-white shadow-lg rounded-xl p-5 cursor-pointer transform hover:-translate-y-1 hover:shadow-2xl transition duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold">{u.name}</h2>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                {u.email ? "Active" : "No Email"}
              </span>
            </div>
            <p className="text-gray-600 mb-1"><strong>Email:</strong> {u.email || "N/A"}</p>
            <p className="text-gray-600 mb-1"><strong>Phone:</strong> {u.phone || "N/A"}</p>
            <p className="text-gray-500 text-sm"><strong>Joined:</strong> {new Date(u.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

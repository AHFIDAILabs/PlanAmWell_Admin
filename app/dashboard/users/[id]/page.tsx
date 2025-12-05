"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAllUsers } from "../../../services/AdminService";

export default function UserDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        const data = await getAllUsers();
        const u = data.find((item: any) => item._id === id);
        setUser(u);
      } catch (err: any) {
        setError(err.message || "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <p>Loading user details...</p>;
  if (error) return <p>Error loading user: {error}</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div className="p-6 flex justify-center">
      <div className="max-w-xl w-full bg-white shadow-2xl rounded-2xl p-8 space-y-4 transform hover:scale-105 transition duration-300">
        <h1 className="text-3xl font-bold text-pink-600 mb-4">{user.name}</h1>
        <div className="mt-4 space-y-2">
          <p><strong>Email:</strong> {user.email || "N/A"}</p>
          <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
          <p><strong>Joined At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
          {/* Add more fields like address, subscriptions, etc. */}
        </div>
        <button
          className="mt-6 w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-200"
          onClick={() => alert("Future admin actions go here")}
        >
          Manage User
        </button>
      </div>
    </div>
  );
}

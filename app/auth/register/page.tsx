"use client";

import { useState } from "react";
import axios from "axios";
import { useTheme } from "../../context/ThemeContext";
import { useRouter } from "next/navigation";

export default function AdminRegisterPage() {
  const { colors } = useTheme();
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/adminRegister`,
        form
      );
      localStorage.setItem("token", data.data.token);
      router.push("/dashboard"); // redirect to dashboard after registration
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="flex flex-col min-h-screen">
    {/* Top image */}
    <div
      className="w-full h-64 md:h-80 bg-cover bg-center"
      style={{
        backgroundImage: "url('/reproductive.jpeg')", // Change if needed
      }}
    ></div>

    {/* Overlapping form */}
    <div className="flex w-full justify-center px-4 -mt-16 md:-mt-20">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl"
        style={{ background: colors.card, color: colors.text }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Admin Registration
        </h2>

        {error && <p className="mb-4 text-red-600">{error}</p>}

        <input
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded border"
          style={{
            borderColor: colors.border,
            background: colors.background,
            color: colors.text,
          }}
        />

        <input
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded border"
          style={{
            borderColor: colors.border,
            background: colors.background,
            color: colors.text,
          }}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded border"
          style={{
            borderColor: colors.border,
            background: colors.background,
            color: colors.text,
          }}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded border"
          style={{
            borderColor: colors.border,
            background: colors.background,
            color: colors.text,
          }}
        />

        <button
          type="submit"
          className="w-full py-3 rounded font-semibold"
          style={{ background: colors.primary, color: colors.text }}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  </div>
);

}

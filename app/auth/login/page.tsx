"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "../../context/ThemeContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const { colors } = useTheme();
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hydrated, setHydrated] = useState(false);

  // ✅ Hydration guard
  useEffect(() => {
    setHydrated(true);
  }, []);

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (!hydrated) return;
    const token = localStorage.getItem("token");
    if (token) router.replace("/dashboard");
  }, [hydrated, router]);

  if (!hydrated) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/adminLogin`,
        {
          email: form.email.trim(),
          password: form.password,
        }
      );

      const token = response.data?.data?.token || response.data?.token;
      if (!token) throw new Error("Token not found in response");

      localStorage.setItem("token", token);
      router.replace("/dashboard"); // safe client redirect
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side image */}
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/Reproductive.jpeg')" }}
      ></div>

      {/* Right side form */}
      <div className="flex w-full md:w-1/2 items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg"
          style={{ background: colors.card, color: colors.text }}
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
          {error && <p className="mb-4 text-red-600">{error}</p>}

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
            className="w-full p-3 mb-4 rounded border outline-none"
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
            disabled={loading}
            className="w-full p-3 mb-4 rounded border outline-none"
            style={{
              borderColor: colors.border,
              background: colors.background,
              color: colors.text,
            }}
          />

          <div className="flex justify-between mb-4 text-sm">
            <Link href="/auth/forgot-password" className="text-blue-600 hover:underline">
              Forgot Password?
            </Link>
            <Link href="/auth/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded font-semibold"
            style={{ background: colors.primary, color: colors.text }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

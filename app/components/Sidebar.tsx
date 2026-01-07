"use client";

import {
  Home,
  Users,
  Stethoscope,
  FileText,
  Building2,
  LogOut,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const router = useRouter();
  const [advocacyOpen, setAdvocacyOpen] = useState(false);
  const [doctorsOpen, setDoctorsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/auth/login");
  };

  const menuButtonClasses =
    "flex items-center gap-3 font-medium w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-pink-50 hover:text-pink-600";

  const subMenuButtonClasses =
    "pl-12 py-1 text-sm text-gray-600 rounded-md hover:text-pink-600 hover:bg-pink-50 transition-colors duration-200";

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6 hidden md:flex flex-col justify-between shadow-sm">
      {/* Top Section */}
      <div>
        <h2 className="text-xl font-semibold mb-8 text-pink-600">Admin Panel</h2>

        <nav className="space-y-1">
          {/* Dashboard */}
          <button
            onClick={() => router.push("/dashboard")}
            className={menuButtonClasses}
          >
            <Home size={18} /> Dashboard
          </button>

          {/* Users */}
          <button
            onClick={() => router.push("/dashboard/users")}
            className={menuButtonClasses}
          >
            <Users size={18} /> Users
          </button>

          {/* Doctors */}
          <div>
            <button
              onClick={() => setDoctorsOpen(!doctorsOpen)}
              className={`${menuButtonClasses} justify-between`}
            >
              <div className="flex items-center gap-3">
                <Stethoscope size={18} /> Doctors
              </div>
              {doctorsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            <div
              className={`flex flex-col mt-1 gap-1 overflow-hidden transition-all duration-300 ${
                doctorsOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <button
                onClick={() => router.push("/dashboard/doctors")}
                className={subMenuButtonClasses}
              >
                All Doctors
              </button>
            </div>
          </div>

          {/* Advocacy */}
          <div>
            <button
              onClick={() => setAdvocacyOpen(!advocacyOpen)}
              className={`${menuButtonClasses} justify-between`}
            >
              <div className="flex items-center gap-3">
                <FileText size={18} /> Advocacy
              </div>
              {advocacyOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            <div
              className={`flex flex-col mt-1 gap-1 overflow-hidden transition-all duration-300 ${
                advocacyOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <button
                onClick={() => router.push("/dashboard/advocacy")}
                className={subMenuButtonClasses}
              >
                All Articles
              </button>

              <button
                onClick={() => router.push("/dashboard/advocacy/create")}
                className={subMenuButtonClasses}
              >
                Create New Article
              </button>
            </div>
          </div>

          {/* Partners */}
          <button
            onClick={() => router.push("/dashboard/partners")}
            className={menuButtonClasses}
          >
            <Building2 size={18} /> Partners
          </button>
        </nav>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 text-red-500 font-medium hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors duration-200 mt-6"
      >
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
}

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
import { useState, useEffect } from "react";
import { usePartner } from "../hooks/usePartner";

export default function Sidebar() {
  const router = useRouter();

  const [partnersOpen, setPartnersOpen] = useState(false);
  const [advocacyOpen, setAdvocacyOpen] = useState(false);
  const [doctorsOpen, setDoctorsOpen] = useState(false);

  const { partners, fetchAllPartners } = usePartner();

useEffect(() => {
  const loadPartners = async () => {
    await fetchAllPartners();
  };
  loadPartners();
}, []);


  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/auth/login");
  };

  return (
    <aside className="w-64 bg-white border-r border-pink-600 p-6 hidden md:flex flex-col justify-between">
      {/* Top Section */}
      <div>
        <h2 className="text-xl font-bold mb-8 text-pink-600">Admin Panel</h2>

        <nav className="space-y-2">
          {/* Dashboard */}
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-3 text-pink-600 font-medium hover:text-pink-600 cursor-pointer w-full text-left"
          >
            <Home size={18} /> Dashboard
          </button>

          {/* Users */}
          <button
            onClick={() => router.push("/dashboard/users")}
            className="flex items-center gap-3 text-gray-700 font-medium hover:text-pink-600 cursor-pointer w-full text-left"
          >
            <Users size={18} /> Users
          </button>

          {/* Doctors */}
          <div>
            <button
              onClick={() => setDoctorsOpen(!doctorsOpen)}
              className="flex items-center justify-between w-full text-gray-700 font-medium hover:text-pink-600 cursor-pointer gap-3"
            >
              <div className="flex items-center gap-3">
                <Stethoscope size={18} /> Doctors
              </div>
              {doctorsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {doctorsOpen && (
              <div className="ml-6 mt-2 flex flex-col gap-1">
                <button
                  onClick={() => router.push("/dashboard/doctors")}
                  className="text-gray-600 text-sm hover:text-pink-600 text-left"
                >
                  All Doctors
                </button>

                <button
                  onClick={() => router.push("/dashboard/doctors/applications")}
                  className="text-gray-600 text-sm hover:text-pink-600 text-left"
                >
                  Doctor Applications
                </button>
              </div>
            )}
          </div>

          {/* Advocacy */}
          <div>
            <button
              onClick={() => setAdvocacyOpen(!advocacyOpen)}
              className="flex items-center justify-between w-full text-gray-700 font-medium hover:text-pink-600 cursor-pointer gap-3"
            >
              <div className="flex items-center gap-3">
                <FileText size={18} /> Advocacy
              </div>
              {advocacyOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {advocacyOpen && (
              <div className="ml-6 mt-2 flex flex-col gap-1">
                <button
                  onClick={() => router.push("/dashboard/advocacy")}
                  className="text-gray-600 text-sm hover:text-pink-600 text-left"
                >
                  All Articles
                </button>

                <button
                  onClick={() => router.push("/dashboard/advocacy/create")}
                  className="text-gray-600 text-sm hover:text-pink-600 text-left"
                >
                  Create New Article
                </button>
              </div>
            )}
          </div>

          {/* Partners */}
          <div>
            <button
              onClick={() => setPartnersOpen(!partnersOpen)}
              className="flex items-center justify-between w-full text-gray-700 font-medium hover:text-pink-600 cursor-pointer gap-3"
            >
              <div className="flex items-center gap-3">
                <Building2 size={18} /> Partners
              </div>
              {partnersOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

          {partnersOpen && (
  <div className="ml-6 mt-2 flex flex-col gap-1">
    {partners.length === 0 ? (
      <span className="text-gray-500 text-sm">No partners found</span>
    ) : (
      partners.map((partner) => (
        <button
          key={partner._id}
          onClick={() => router.push(`/dashboard/partners/${partner._id}`)}
          className="text-gray-600 text-sm hover:text-pink-600 text-left"
        >
          {partner.name}
        </button>
      ))
    )}
  </div>
)}

          </div>
        </nav>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 text-red-600 font-medium hover:text-red-700 cursor-pointer mt-10"
      >
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
}

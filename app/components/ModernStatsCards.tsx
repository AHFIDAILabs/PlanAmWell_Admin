"use client";

import { Users, Stethoscope, Clock, DollarSign } from "lucide-react";
import { useCombinedGrowth } from "../hooks/useCombinedGrowth";

type StatItem = {
  title: string;
  value: string | number;
  growth: number;
  icon: any;
  gradient: string;
};

export default function ModernStatsCards() {
  const { growthData, loading, error } = useCombinedGrowth(1); // last month

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-2xl bg-gray-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error || !growthData) return null;

  const stats: StatItem[] = [
    {
      title: "Total Users",
      value: growthData.totalUsers,
      growth: Number(growthData.userGrowthPercentage) || 0,
      icon: Users,
      gradient: "from-pink-500 to-rose-500",
    },
    {
      title: "Active Doctors",
      value: growthData.totalApprovedDoctors,
      growth: Number(growthData.doctorGrowthPercentage) || 0,
      icon: Stethoscope,
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      title: "Pending Approvals",
      value: growthData.totalPendingDoctors,
      growth: Number(growthData.pendingGrowthPercentage) || 0,
      icon: Clock,
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      title: "Monthly Revenue",
      value: `$${(growthData.monthlyRevenue || 0).toLocaleString()}`,
      growth: Number(growthData.revenueGrowthPercent) || 0,
      icon: DollarSign,
      gradient: "from-emerald-500 to-green-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
      {stats.map((item, index) => {
        const Icon = item.icon;
        const isNegative = item.growth < 0;

        return (
          <div
            key={index}
            className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm border border-gray-100"
          >
            {/* Gradient bubble */}
            <div
              className={`absolute -top-6 -right-6 h-24 w-24 rounded-full bg-linear-to-br ${item.gradient} opacity-20`}
            />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{item.title}</p>
                <p className="text-2xl font-bold mt-1">
                  {typeof item.value === "number"
                    ? item.value.toLocaleString()
                    : item.value}
                </p>

                <span
                  className={`inline-flex items-center text-xs font-medium mt-1 ${
                    isNegative ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {isNegative ? "↓" : "↑"} {Math.abs(item.growth).toFixed(1)}%
                </span>
              </div>

              <div
                className={`p-3 rounded-xl bg-linear-to-br ${item.gradient} text-white shadow`}
              >
                <Icon size={20} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

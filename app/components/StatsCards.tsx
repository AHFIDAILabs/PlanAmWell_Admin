"use client";

import { Card, CardContent } from "../components/ui/Card";
import { useCombinedGrowth } from "../hooks/useCombinedGrowth";

export default function StatsCards() {
  const { growthData, loading, error } = useCombinedGrowth(1); // last month

  if (loading) return <p>Loading stats...</p>;
  if (error) return <p>Error loading stats: {error}</p>;

  // Default values to prevent undefined errors
  const gd = {
    totalUsers: growthData?.totalUsers ?? 0,
    userGrowthPercent: Number(growthData?.userGrowthPercentage) || 0,
    totalApprovedDoctors: growthData?.totalApprovedDoctors ?? 0,
    doctorGrowthPercent: Number(growthData?.doctorGrowthPercentage) || 0,
    totalPendingDoctors: growthData?.totalPendingDoctors ?? 0,
    pendingGrowthPercent: Number(growthData?.pendingGrowthPercentage) || 0,
    monthlyRevenue: growthData?.monthlyRevenue ?? 0,
    revenueGrowthPercent: Number(growthData?.revenueGrowthPercent) || 0,
  };

  const stats = [
    {
      title: "Total Users",
      value: gd.totalUsers.toLocaleString(),
      growth: `${gd.userGrowthPercent.toFixed(1)}%`,
    },
    {
      title: "Active Doctors",
      value: gd.totalApprovedDoctors.toLocaleString(),
      growth: `${gd.doctorGrowthPercent.toFixed(1)}%`,
    },
    {
      title: "Pending Approvals",
      value: gd.totalPendingDoctors.toString(),
      growth: `${gd.pendingGrowthPercent.toFixed(1)}%`,
    },
    {
      title: "Monthly Revenue",
      value: `$${gd.monthlyRevenue.toLocaleString()}`,
      growth: `${gd.revenueGrowthPercent.toFixed(1)}%`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((item, index) => (
        <Card key={index} className="shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">{item.title}</p>
            <p className="text-2xl font-semibold">{item.value}</p>
            <p
              className={`text-xs ${
                item.growth.startsWith("-") ? "text-red-500" : "text-green-500"
              }`}
            >
              {item.growth}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

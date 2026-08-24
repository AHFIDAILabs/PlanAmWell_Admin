"use client";

import { Users, Stethoscope, Clock, DollarSign } from "lucide-react";
import { useCombinedGrowth } from "../hooks/useCombinedGrowth";
import { StatCard } from "./ui/StatCard";
import { Card } from "./ui/Card";

type StatItem = {
  title: string;
  value: string | number;
  growth: number;
  icon: any;
};

export default function ModernStatsCards() {
  const { growthData, loading, error } = useCombinedGrowth(1); // last month

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="h-28 animate-pulse bg-surface-container-low" />
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
    },
    {
      title: "Active Doctors",
      value: growthData.totalApprovedDoctors,
      growth: Number(growthData.doctorGrowthPercentage) || 0,
      icon: Stethoscope,
    },
    {
      title: "Pending Approvals",
      value: growthData.totalPendingDoctors,
      growth: Number(growthData.pendingGrowthPercentage) || 0,
      icon: Clock,
    },
    {
      title: "Monthly Revenue",
      value: `$${(growthData.monthlyRevenue || 0).toLocaleString()}`,
      growth: Number(growthData.revenueGrowthPercent) || 0,
      icon: DollarSign,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
      {stats.map((item) => (
        <StatCard
          key={item.title}
          label={item.title}
          value={item.value}
          growth={item.growth}
          icon={<item.icon size={20} />}
        />
      ))}
    </div>
  );
}

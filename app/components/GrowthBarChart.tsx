"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { useCombinedGrowth } from "../hooks/useCombinedGrowth";

export default function GrowthStackedBarChart() {
  const { growthData, loading, error } = useCombinedGrowth(3);

  if (loading || error || !growthData) return null;

  // Prepare weekly data: each week has users and doctors counts
  const data =
    growthData?.weeklyGrowth?.map((w: any) => ({
      week: w.label,
      Users: Number(w.users) || 0,
      Doctors: Number(w.doctors) || 0,
    })) || [];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="font-semibold text-lg mb-4">
        Weekly Users & Doctors
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="week" tick={{ fill: "#6b7280" }} />
          <YAxis tick={{ fill: "#6b7280" }} />
          <Tooltip
            formatter={(value: any, name: string) => [value.toLocaleString(), name]}
          />
          <Legend />
          {/* Stacked bars */}
          <Bar dataKey="Users" stackId="a" fill="#ec4899" radius={[6, 6, 0, 0]} />
          <Bar dataKey="Doctors" stackId="a" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

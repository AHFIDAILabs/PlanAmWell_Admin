"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useCombinedGrowth } from "../hooks/useCombinedGrowth";

const COLORS = ["#22c55e", "#facc15", "#ef4444"];

export default function DoctorStatusChart() {
  const { growthData, loading, error } = useCombinedGrowth(1);

  if (loading || error) return null;

  const data = [
    { name: "Approved", value: growthData?.totalApprovedDoctors ?? 0 },
    { name: "Pending", value: growthData?.totalPendingDoctors ?? 0 },
    { name: "Rejected", value: growthData?.totalRejectedDoctors ?? 0 },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h3 className="font-semibold text-lg mb-4">
        Doctor Approval Status
      </h3>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            innerRadius={70}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

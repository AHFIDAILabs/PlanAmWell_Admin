import StatsCards from "../components/StatsCards";
import UserGrowthChart from "../components/UserGrowthChart";
import RecentUsers from "../components/RecentUsers";
import PendingDoctors from "../components/PendingDoctors";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <StatsCards />
      <UserGrowthChart />
      <RecentUsers />
      <PendingDoctors />
    </div>
  );
}

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { PartnerProvider } from "../context/PartnerContext"; // Import it here

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <PartnerProvider> {/* Wrap the dashboard content here */}
      <div className="flex h-screen bg-gray-50">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="p-6 overflow-y-auto">{children}</main>
        </div>
      </div>
    </PartnerProvider>
  );
}
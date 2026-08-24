import AdminShell from "../components/layout/AdminShell";
import { PartnerProvider } from "../context/PartnerContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <PartnerProvider>
      <AdminShell>
        <div className="p-6">{children}</div>
      </AdminShell>
    </PartnerProvider>
  );
}
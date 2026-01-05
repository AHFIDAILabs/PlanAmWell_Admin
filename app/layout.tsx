// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "./context/ThemeContext";
import { PartnerProvider } from "./context/PartnerContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Admin Dashboard",
  description: "Dashboard for Plan Am Well",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
           {/* Remove PartnerProvider from here */}
           {children}
           <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}

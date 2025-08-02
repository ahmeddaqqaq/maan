// import MainLayout from "./components/main-layout";
import "./globals.css";
import { Geist, Geist_Mono, Roboto, Nunito } from "next/font/google";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { Toaster } from "@/components/ui/sonner";
// Initialize API configuration
import "@/lib/api-config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} ${nunito.variable}`}
      >
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

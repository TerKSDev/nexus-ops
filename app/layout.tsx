import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: { default: "Nexus Ops", template: "%s | Nexus Ops" },
  description: "Automated Git Actions for effortless code deployment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased`}>
      <body className="min-h-screen flex flex-1 overflow-hidden">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}

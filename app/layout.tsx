import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";

import GlobalSearchModal from "@/components/GlobalSearchModal";

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
    <html lang="en" className={`h-full antialiased selection:bg-healthy-500 selection:text-neutral-700`}>
      <body className="min-h-screen flex flex-1 overflow-hidden">
        <ToastProvider>
          {children}
          <GlobalSearchModal />
        </ToastProvider>
      </body>
    </html>
  );
}

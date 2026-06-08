import SideNav from "@/components/SideNav";
import AutoRefresh from "@/components/AutoRefresh";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <>
      <AutoRefresh intervalMs={10000} />
      <SideNav />
      <main className="flex-1 overflow-y-auto h-screen flex flex-col relative">
        {children}
      </main>
    </>
  );
}

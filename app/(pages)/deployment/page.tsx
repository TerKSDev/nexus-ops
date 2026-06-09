import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import DeploymentList from "./components/DeploymentList";

export default async function VercelPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch initial deployments and user's repositories in parallel
  const [deployments, repos] = await Promise.all([
    prisma.logs.findMany({
      where: {
        type: "DEPLOYMENT",
        repo: { userId: session.user.id },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { repo: true },
    }),
    prisma.githubRepo.findMany({
      where: { userId: session.user.id },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="p-8 px-12 w-full max-w-7xl mx-auto flex flex-1 flex-col gap-10">
      {/* Page Header — HSR style */}
      <div className="flex items-start justify-between gap-8">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-1 self-stretch py-0.5">
            <div className="w-px flex-1 bg-linear-to-b from-healthy-500 via-healthy-500/40 to-transparent" />
            <span className="text-healthy-500 text-[7px] leading-none">◆</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-healthy-500/50 tracking-[0.3em] uppercase font-medium">
              CI / CD Pipeline
            </span>
            <h1 className="text-3xl font-bold text-neutral-50 tracking-widest uppercase leading-none">
              Deployments
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="h-px w-8 bg-linear-to-r from-healthy-500/40 to-transparent" />
              <p className="text-neutral-400 text-sm">
                Track your application builds and deployments via GitHub
                Webhooks.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/repository"
          className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-healthy-600 to-healthy-500 text-neutral-950 font-bold rounded-lg hover:from-healthy-500 hover:to-healthy-400 hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all duration-300 text-sm text-center shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Repository
        </Link>
      </div>

      <div className="flex flex-col gap-8 flex-1">
        <DeploymentList initialDeployments={deployments as any} repos={repos} />
      </div>
    </div>
  );
}
